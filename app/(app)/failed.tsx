import { Image } from "expo-image";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { Dimensions, View } from "react-native";
import { vs } from "react-native-size-matters";

const Failed = () => {
  const width = Dimensions.get("window").width;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.navigate("/(home)");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#181C2E" }}>
      <Image
        source={require("@/assets/images/error.png")}
        style={{ width: width * 0.8, height: width * 0.8 }}
      />
      <Text
        className="text-center text-white text-lg"
        style={{
          marginTop: vs(20),
        }}
      >
        Something went wrong. Your order could not be placed. You will be
        redirected to the home screen shortly.
      </Text>
    </View>
  );
};

export default Failed;
