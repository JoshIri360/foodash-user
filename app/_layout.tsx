import CustomKAV from "@/components/CustomKAV";
import { authStateSubscriber, useAuthStore } from "@/context/authStore";
import NetInfo from "@react-native-community/netinfo";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NoInternetAlert from "@/components/NoInternetAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(true);

  authStateSubscriber();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (typeof isAuthenticated === "undefined") return;
      const inApp = segments[0] === "(app)";
      const onboarded = await AsyncStorage.getItem("onboarded");
      if (!isAuthenticated && onboarded === "true") {
        router.replace("/signIn");
      } else {
        if (onboarded !== "true") {
          router.replace("/onboarding");
        } else if (isAuthenticated && !inApp) {
          router.replace<any>("/(app)/(home)");
        }
      }
    };

    checkOnboarding();
  }, [isAuthenticated]);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      {!isConnected && <NoInternetAlert />}
    </View>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomKAV>
        <MainLayout />
      </CustomKAV>
    </GestureHandlerRootView>
  );
}
