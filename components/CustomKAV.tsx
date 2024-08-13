import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ios = Platform.OS === "ios";

export default function CustomKAV({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flexGrow: 1,
          // backgroundColor: "#262422",
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
        }}
        // bounces={false}
        // showsHorizontalScrollIndicator={false}
      >
        {children}
      </View>
    </KeyboardAvoidingView>
  );
}
