import Cart from "@/app/(app)/cart";
import useCartStore from "@/context/cartStore";
import { useUniversityStore } from "@/context/universityStore";
import { getTotalAmount } from "@/utils/calculateOrder";
import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Location {
  id: string;
  name: string;
  price?: number;
}

interface OrderBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  totalAmount: number;
}

interface CartItemProps {
  meal: Cart;
  carts: Cart[];
  locations: Location[];
  currentLocation: string;
  restaurantId: string;
  setTotalAmount: (amount: number) => void;
  fetchOrderDetails: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  meal,
  carts,
  locations,
  currentLocation,
  restaurantId,
  setTotalAmount,
  fetchOrderDetails,
}) => {
  const { addToCart, reduceCart, removeMeal } = useCartStore();
  const { currentUniversity } = useUniversityStore();

  const currentLocationPrice =
    locations.find((loc) => loc.id === currentLocation)?.price || 0;

  const handleAddToCart = () => {
    addToCart({ ...meal, quantity: 1 });
    updateTotalAmount();
    fetchOrderDetails();
  };

  const handleReduceCart = () => {
    reduceCart(meal.mealId);
    updateTotalAmount();
    fetchOrderDetails();
  };

  const handleRemoveMeal = () => {
    removeMeal(meal.mealId);
    updateTotalAmount();
    fetchOrderDetails();
  };

  const updateTotalAmount = () => {
    getTotalAmount(
      carts,
      restaurantId,
      currentUniversity,
      currentLocationPrice
    ).then(setTotalAmount);
  };

  return (
    <View>
      <View key={meal.mealId} className="flex-row w-full rounded-lg mb-3">
        <Image
          source={meal.images[0]}
          style={{
            width: 96,
            height: 96,
            borderRadius: 12,
            marginRight: 16,
          }}
        />
        <View className="flex-1 justify-between">
          <View>
            <Text
              className="font-light text-white text-xl"
              style={{
                fontFamily: "SenRegular",
              }}
            >
              {meal.name}
            </Text>
            <Text
              className="text-base font-bold text-white"
              style={{
                fontFamily: "SenBold",
              }}
            >
              ₦ {meal.price}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <Pressable
                onPress={handleReduceCart}
                className="bg-[#464958] rounded-full w-6 h-6 items-center justify-center"
              >
                <Entypo name="minus" size={16} color="white" />
              </Pressable>
              <Text
                className="mx-3 text-white text-lg"
                style={{
                  fontFamily: "SenBold",
                }}
              >
                {meal.quantity || 0}
              </Text>
              <Pressable
                onPress={handleAddToCart}
                className="bg-[#464958] rounded-full w-6 h-6 items-center justify-center"
              >
                <Entypo name="plus" size={16} color="white" />
              </Pressable>
            </View>
            <Pressable
              onPress={handleRemoveMeal}
              className="bg-red-600 rounded-full w-6 h-6 items-center justify-center"
            >
              <Entypo name="trash" size={14} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
