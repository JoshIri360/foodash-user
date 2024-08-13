import useCartStore from "@/context/cartStore";
import { useRestaurantStore } from "@/context/restaurantStore";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { s, vs } from "react-native-size-matters";

interface Meal {
  category: string;
  images: string[];
  name: string;
  price: number;
  id: string;
  available?: boolean;
}

interface MealPreparationTime {
  high: number;
  low: number;
}

const Header_Max_Height = 240;
const Header_Min_Height = 70;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({
  value,
  restaurantId,
  currentRestaurant,
  carts,
  isCartEmpty,
}: any) => {
  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  const animatedHeaderColor = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: ["#181d3137", "#181d31f0"],
    extrapolate: "clamp",
  });

  const animatedOpacity = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        height: animatedHeaderHeight,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        right: 0,
      }}
    >
      <View className="items-center justify-between w-full">
        <View className="absolute w-full px-3 pt-3 top-0 left-0 right-0 justify-between z-10 flex-row">
          <View className="flex-row items-center justify-center">
            <Pressable
              onPress={() => router.push("/(home)")}
              className="bg-white p-1.5 rounded-full aspect-square items-center justify-center"
              style={{
                height: vs(32),
              }}
            >
              <Entypo name="chevron-left" size={24} color="#181C2E" />
            </Pressable>
            <Animated.View
              className="ml-5"
              style={{
                opacity: animatedOpacity,
              }}
            >
              <Text
                className="text-2xl text-white"
                style={{
                  fontFamily: "SenBold",
                }}
              >
                {currentRestaurant?.restaurantName}
              </Text>
            </Animated.View>
          </View>
          <Pressable
            onPress={() =>
              router.push<any>({
                pathname: "/cart",
                params: {
                  restaurantId: restaurantId,
                },
              })
            }
            className="bg-[#1A2424] p-1.5 rounded-full aspect-square items-center justify-center"
            style={{
              height: vs(32),
            }}
            disabled={isCartEmpty}
          >
            <View className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 items-center justify-center z-10 rounded-full">
              <Text
                className="text-xs rounded-full text-white"
                style={{
                  fontFamily: "SenBold",
                }}
              >
                {carts.length}
              </Text>
            </View>
            <Entypo
              name="shopping-cart"
              size={24}
              color={isCartEmpty ? "#737881" : "#fff"}
            />
          </Pressable>
        </View>
        <Image
          source={{ uri: currentRestaurant.coverImage }}
          style={{
            width: "100%",
            height: "100%",
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
            backgroundColor: "#181D31",
          }}
        />
      </View>
      <Animated.View
        className="absolute w-full h-full"
        style={{
          borderBottomLeftRadius: 35,
          borderBottomRightRadius: 35,
          backgroundColor: animatedHeaderColor,
        }}
      ></Animated.View>
    </Animated.View>
  );
};

export default function Restaurant() {
  const params = useLocalSearchParams();
  let { restaurant: restaurantId } = params;

  const { addToCart, fetchCart, getCartsByRestaurant } = useCartStore();
  const { currentRestaurant, meals, setCurrentRestaurant } =
    useRestaurantStore();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const [carts, setCarts] = useState<any[]>([]);

  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const fetchAndSetCarts = async () => {
    await fetchCart();
  };

  const filteredMeals = meals.filter(
    (meal) =>
      meal.category === currentRestaurant?.mealCategories[selectedCategory] &&
      meal.available !== false
  );

  // if (cartLoading) {
  //   return <ActivityIndicator size="large" />;
  // }

  useEffect(() => {
    const initializeRestaurantAndFetchCarts = async () => {
      try {
        setLoading(true);

        if (
          restaurantId &&
          (!currentRestaurant || currentRestaurant.id !== restaurantId)
        ) {
          await setCurrentRestaurant(restaurantId as string);
        }

        await fetchAndSetCarts();

        const restaurantCarts = getCartsByRestaurant();
        setCarts(restaurantCarts[restaurantId as any] || []);
      } catch (error) {
        console.error(
          "Error initializing restaurant or fetching carts:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    initializeRestaurantAndFetchCarts();
  }, [restaurantId, currentRestaurant, setCurrentRestaurant]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchAndSetCarts()]).then(() => setRefreshing(false));
  }, [fetchCart]);

  const isCartEmpty = carts.length === 0;

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!currentRestaurant) {
    return <Text>No restaurant found</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <DynamicHeader
        value={scrollOffsetY}
        restaurantId={restaurantId}
        currentRestaurant={currentRestaurant}
        carts={carts}
        isCartEmpty={isCartEmpty}
      />

      <ScrollView
        scrollEventThrottle={5}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: false,
          }
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1">
          <View style={{ paddingHorizontal: s(12), marginVertical: vs(10) }}>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 20,
                fontFamily: "SenBold",
              }}
            >
              {currentRestaurant?.restaurantName}
            </Text>
            <Text
              className="text-[#A0A5BA]"
              style={{
                fontSize: 14,
                lineHeight: 20,
                fontFamily: "SenRegular",
              }}
            >
              {currentRestaurant?.description ||
                "Delight in our chef's special creations! This cozy restaurant offers a wide variety of dishes, carefully crafted to satisfy your taste buds. Come and enjoy a memorable dining experience!"}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="grow-0"
          >
            <View
              style={{ paddingHorizontal: s(12) }}
              className="flex flex-row space-x-4 px-3"
            >
              {currentRestaurant.mealCategories &&
                currentRestaurant.mealCategories.map((category, index) => (
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(index)}
                    key={category}
                    className={`${
                      selectedCategory === index
                        ? "bg-[#00A36C] text-white"
                        : "border-2 border-[#EDEDED] text-white"
                    } items-center justify-center px-4 py-2 rounded-full`}
                  >
                    <Text
                      className={`${
                        selectedCategory === index
                          ? "text-white"
                          : "text-[#181C2E]"
                      }`}
                      style={{
                        fontSize: 16,
                        lineHeight: 20,
                        fontFamily: "SenRegular",
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
          <View
            className="w-screen py-2 flex-1"
            style={{ paddingHorizontal: s(14) }}
          >
            <View className="flex flex-row flex-wrap justify-between">
              {filteredMeals.length > 0 ? (
                filteredMeals.map((meal) => (
                  <View
                    key={meal.id}
                    className="w-[48%] mb-4 rounded-3xl p-3 bg-[#d2d2d260]"
                  >
                    <View className="w-full aspect-square mb-2">
                      <Image
                        source={{ uri: meal.images[0] }}
                        className="w-full h-full rounded-3xl"
                      />
                    </View>
                    <Text className="text-lg font-semibold text-[#32343E]">
                      {meal.name}
                    </Text>
                    <View className="rounded-lg flex-row items-end justify-between w-full">
                      <Text
                        className="text-lg text-[#181C2E]"
                        style={{
                          fontFamily: "SenBold",
                        }}
                      >
                        ₦{meal.price}
                      </Text>
                      <Pressable
                        onPress={() => {
                          addToCart({
                            restaurantId: restaurantId as string,
                            mealId: meal.id,
                            quantity: 1,
                            name: meal.name,
                            price: meal.price,
                            images: meal.images,
                          });
                          const restaurantCarts = getCartsByRestaurant();
                          setCarts(restaurantCarts[restaurantId as any] || []);
                        }}
                        className="bg-[#00A36C] rounded-full w-9 items-center justify-center aspect-square"
                      >
                        <Entypo name="plus" size={24} color="white" />
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <View className="flex items-center justify-center w-full h-full">
                  <FontAwesome
                    name="exclamation-circle"
                    size={48}
                    color="#ffcc00"
                  />
                  <Text className="text-lg text-[#32343E] mt-2">
                    No meals available
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
