import { registerForPushNotificationsAsync } from "@/components/notifications";
import {
  Sen_400Regular,
  Sen_700Bold,
  Sen_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/sen";
import { Archivo_500Medium } from "@expo-google-fonts/archivo";
import {
  Manrope_500Medium,
  Manrope_600SemiBold,
} from "@expo-google-fonts/manrope";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function Index() {
  const [isConnected, setIsConnected] = useState(true);

  let [fontsLoaded, fontError] = useFonts({
    SenBold: Sen_700Bold,
    SenRegular: Sen_400Regular,
    SenExtraBold: Sen_800ExtraBold,
    ArchivoMedium: Archivo_500Medium,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
  });

  registerForPushNotificationsAsync();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state?.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    if (!isConnected) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
    }
  }, [isConnected, fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );
}
