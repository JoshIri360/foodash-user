import Path from "@/assets/images/onboarding/path.svg";
import { Feather } from "@expo/vector-icons";
import { Link, useNavigation, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { s, vs } from "react-native-size-matters";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const router = useRouter();
  const onboardingData = [
    {
      title: "Welcome to Foodash",
      description:
        "Discover the best dining options around you and enjoy seamless food ordering right from your device.",
      image: require("@/assets/images/onboarding/1.png"),
    },
    {
      title: "Explore Restaurants",
      description:
        "Browse a variety of restaurants, view menus, and find your favorites—all in one place!",
      image: require("@/assets/images/onboarding/2.png"),
    },
    {
      title: "Are you Ready?",
      description:
        "Place your order and get your meals delivered to you in no time!",
      image: require("@/assets/images/onboarding/3.png"),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fadeAnimSub] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimSub, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [currentIndex]);

  const handleBackPress = () => {
    if (currentIndex > 0) {
      handlePrevious();
      return true;
    }
    return false;
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      fadeAnim.setValue(0);
      fadeAnimSub.setValue(0);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      fadeAnim.setValue(0);
      fadeAnimSub.setValue(0);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onGestureEvent = (event: {
    nativeEvent: { state: number; translationX: number };
  }) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 50 && currentIndex > 0) {
        handlePrevious();
      } else if (
        event.nativeEvent.translationX < -50 &&
        currentIndex < onboardingData.length - 1
      ) {
        handleNext();
      }
    }
  };

  return (
    <View className="flex-1 justify-between">
      <PanGestureHandler onHandlerStateChange={onGestureEvent}>
        <View className="flex-1 items-center justify-center">
          <Path
            width={"100%"}
            height={"100%"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
          <View className="bg-[#98D79E] w-[90%] aspect-[9/12] items-center justify-center">
            <Image
              source={onboardingData[currentIndex].image}
              resizeMode="contain"
              className="w-32 aspect-square"
            />
          </View>
        </View>
      </PanGestureHandler>
      <View style={{ paddingHorizontal: s(16), paddingBottom: vs(12) }}>
        <View className="px-2">
          <Animated.Text
            className="text-[#005C2D]"
            style={{
              fontFamily: "ArchivoMedium",
              fontSize: 30,
              lineHeight: 36,
              opacity: fadeAnim,
            }}
          >
            {onboardingData[currentIndex].title}
          </Animated.Text>
          <Animated.Text
            className="text-[#005C2D]"
            style={{
              fontFamily: "ManropeMedium",
              fontSize: 16,
              lineHeight: 24,
              marginBottom: vs(16),
              opacity: fadeAnimSub,
            }}
          >
            {onboardingData[currentIndex].description}
          </Animated.Text>
        </View>
        {currentIndex < 2 ? (
          <View
            className="bg-[#005C2D] rounded-md items-center justify-between flex-row"
            style={{
              paddingVertical: vs(8),
              paddingHorizontal: s(8),
            }}
          >
            {currentIndex === 1 ? (
              <TouchableOpacity onPress={handlePrevious}>
                <Feather name="arrow-left-circle" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 24 }} />
            )}
            <View className="flex-row items-center justify-center">
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentIndex ? "bg-white" : "bg-[#4C8D6C]"
                  }`}
                />
              ))}
            </View>
            <TouchableOpacity onPress={handleNext}>
              <Feather name="arrow-right-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-1">
            <TouchableOpacity
              className="bg-[#005C2D] rounded-md flex-row items-center justify-between px-4 py-3"
              onPress={() => {
                AsyncStorage.setItem("onboarded", "true");
                router.push("/createAccount");
              }}
            >
              <Text
                className="text-white font-semibold text-base"
                style={{
                  fontFamily: "ManropeSemiBold",
                }}
              >
                Get Started
              </Text>
              <Feather name="arrow-right-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#6CDE40] rounded-md flex-row items-center justify-between px-4 py-3"
              onPress={() => {
                AsyncStorage.setItem("onboarded", "true");
                router.push("/signIn");
              }}
            >
              <Text
                className="text-[#005C2D] font-semibold text-base"
                style={{
                  fontFamily: "ManropeSemiBold",
                }}
              >
                Login
              </Text>
              <Feather name="arrow-right-circle" size={24} color="#005C2D" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Index;
