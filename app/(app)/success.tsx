import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { Dimensions, View } from "react-native";
import { vs } from "react-native-size-matters";

const Success = () => {
  const width = Dimensions.get("window").width;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.navigate("/(home)");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#181C2E",
      }}
    >
      <LottieView
        source={require("@/assets/animations/successanimation.json")}
        autoPlay
        loop={false}
        style={{
          width: width / 2,
          aspectRatio: 1,
        }}
      />
      <Text
        className="text-center text-white text-lg"
        style={{
          marginTop: vs(20),
        }}
      >
        Your order has been placed successfully. You will be redirected to the
        home screen shortly.
      </Text>
    </View>
  );
};

export default Success;
