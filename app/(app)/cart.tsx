import AlertPrompt from "@/components/AlertPrompt";
import CartItem from "@/components/cart/cartItem";
import WithdrawalSheet from "@/components/cart/withdrawalSheet";
import useCartStore from "@/context/cartStore";
import { useLocationStore } from "@/context/locationStore";
import { useUniversityStore } from "@/context/universityStore";
import { getOrderBreakdown } from "@/utils/calculateOrder";
import { Entypo } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { vs } from "react-native-size-matters";
interface Cart {
  restaurantId: string;
  mealId: string;
  quantity: number;
  name: string;
  price: number;
  images: string[];
}
interface OrderBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  totalAmount: number;
}

const Cart: React.FC = () => {
  const { getCartsByRestaurant } = useCartStore();
  const {
    locations,
    lastOrderLocation,
    setLocationsForRestaurant,
    getLastOrderLocation,
  } = useLocationStore();
  const { currentUniversity } = useUniversityStore();
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

  const [location, setLocation] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [orderBreakdown, setOrderBreakdown] = useState<OrderBreakdown | null>(
    null
  );
  const [exactAddress, setExactAddress] = useState<string>("");
  const [breakdownAlert, setBreakdownAlert] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shouldFetchOrderDetails, setShouldFetchOrderDetails] =
    useState<boolean>(true);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const cartsByRestaurant = getCartsByRestaurant();
  const carts = cartsByRestaurant[restaurantId] ?? [];

  useEffect(() => {
    const initializeLocations = async () => {
      await setLocationsForRestaurant(restaurantId);
      await getLastOrderLocation();
    };
    initializeLocations();
  }, [restaurantId, setLocationsForRestaurant, getLastOrderLocation]);

  useEffect(() => {
    if (lastOrderLocation) {
      setLocation(lastOrderLocation.id);
    } else if (locations.length > 0) {
      setLocation(locations[0].id);
    }
  }, [lastOrderLocation, locations]);

  const fetchOrderDetails = useCallback(async () => {
    if (location && carts.length > 0 && shouldFetchOrderDetails) {
      try {
        const selectedLocation = locations.find((loc) => loc.id === location);
        if (selectedLocation) {
          const breakdown = await getOrderBreakdown(
            carts,
            restaurantId,
            currentUniversity,
            selectedLocation.price ?? locations[0]?.price ?? 0
          );
          setOrderBreakdown(breakdown);
          setTotalAmount(breakdown?.totalAmount || 0);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setErrorAlert(true);
        setErrorMessage("Failed to fetch order details. Please try again.");
      } finally {
        setShouldFetchOrderDetails(false);
      }
    }
  }, [
    location,
    carts,
    shouldFetchOrderDetails,
    restaurantId,
    locations,
    currentUniversity,
  ]);

  useEffect(() => {
    fetchOrderDetails();
  }, [location, carts, restaurantId, locations, fetchOrderDetails]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const renderWithdrawalSheet = () => (
    <>
      {currentUniversity?.locations ? (
        <WithdrawalSheet
          exactAddress={exactAddress}
          setLocation={setLocation}
          setShouldFetchOrderDetails={setShouldFetchOrderDetails}
          location={location}
          totalAmount={totalAmount}
          setExactAddress={setExactAddress}
          setBreakdownAlert={setBreakdownAlert}
          setErrorMessage={setErrorMessage}
          setErrorAlert={setErrorAlert}
        />
      ) : (
        <ActivityIndicator color={"#34A853"} />
      )}
    </>
  );

  const formatBreakdownMessage = (breakdown: OrderBreakdown): string =>
    `
Subtotal: ₦${breakdown.subtotal}
Delivery Fee: ₦${breakdown.deliveryFee}
Service Charge: ₦${breakdown.serviceCharge}
Total Amount: ₦${breakdown.totalAmount}
  `.trim();

  return (
    <View className="flex-1 bg-[#181C2E]">
      <View className="flex-row items-center justify-start w-full px-3 pt-3 pb-1">
        <Pressable
          onPress={() => router.back()}
          className="bg-white p-1.5 rounded-full aspect-square items-center justify-center"
          style={{
            height: vs(32),
          }}
        >
          <Entypo name="chevron-left" size={24} color="#181C2E" />
        </Pressable>
        <Text
          className="text-white text-lg ml-3"
          style={{ fontFamily: "SenBold" }}
        >
          Cart
        </Text>
      </View>
      <View className="flex-1 justify-between mt-4">
        <View className="flex-1" style={{ paddingHorizontal: vs(15) }}>
          {carts.map((meal) => (
            <CartItem
              meal={meal}
              carts={carts}
              locations={locations}
              currentLocation={location}
              restaurantId={restaurantId}
              setTotalAmount={setTotalAmount}
              key={meal.mealId}
              fetchOrderDetails={fetchOrderDetails}
            />
          ))}
        </View>
      </View>
      <View
        className="bottom-3 w-full items-center justify-center"
        style={{ paddingHorizontal: vs(15) }}
      >
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.expand()}
          className="absolute bottom-3 w-full bg-[#34A853] items-center justify-center py-3 rounded-lg"
        >
          <Text className="font-bold text-white text-base uppercase">
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["60%"]}
        index={-1}
        onChange={() => {}}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#fff" }}
        handleComponent={() => (
          <View className="w-full py-3 justify-center items-center">
            <View
              style={{
                backgroundColor: "#b5c6d8",
                width: 60,
                height: 10,
                borderRadius: 100,
              }}
            />
          </View>
        )}
      >
        {renderWithdrawalSheet()}
      </BottomSheet>
      <AlertPrompt
        visible={breakdownAlert}
        title="Breakdown"
        subtitle="Here is the breakdown of your order"
        message={orderBreakdown ? formatBreakdownMessage(orderBreakdown) : ""}
        buttons={[
          {
            text: "Cancel",
            onPress: () => setBreakdownAlert(false),
            backgroundColor: "#A62626",
          },
        ]}
        onClose={() => setBreakdownAlert(false)}
      />
      <AlertPrompt
        visible={errorAlert}
        title="Error"
        subtitle="An error occurred"
        message={errorMessage}
        buttons={[
          {
            text: "Cancel",
            onPress: () => setErrorAlert(false),
            backgroundColor: "#A62626",
          },
        ]}
        onClose={() => setErrorAlert(false)}
      />
    </View>
  );
};

export default Cart;
