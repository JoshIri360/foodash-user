import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { vs } from "react-native-size-matters";

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

export default DynamicHeader;
