import { useAuthStore } from "@/context/authStore";
import useOrderStore from "@/context/orderStore";
import { useRestaurantStore } from "@/context/restaurantStore";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Paystack } from "react-native-paystack-webview";

type PaystackCheckoutProps = {
  amount: string;
  previousRoute: string;
  address: string;
};

export default function PaystackCheckout() {
  const { userData } = useAuthStore();
  let { amount, address } = useLocalSearchParams<PaystackCheckoutProps>();
  const { currentRestaurant } = useRestaurantStore();
  const { createOrder } = useOrderStore();
  const intAmount = Number(amount) || 0;

  return (
    <View>
      {userData?.email && (
        <Paystack
          paystackKey="pk_live_da377496de549b4728fbe9e7c45c55990650b084"
          amount={parseFloat(amount)}
          billingEmail={userData?.email}
          activityIndicatorColor="green"
          onCancel={() => {
            router.push("/failed");
          }}
          firstName={userData?.username}
          phone={userData?.phoneNumber}
          channels={["card", "bank"]}
          onSuccess={() => {
            createOrder(
              address,
              currentRestaurant?.id || "",
              intAmount,
              currentRestaurant?.pushToken || ""
            ).then((res) => {
              if (res.success) {
                router.push("/success");
              } else {
                router.push("/failed");
              }
            });
          }}
          autoStart
        />
      )}
    </View>
  );
}
