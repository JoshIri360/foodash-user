import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/context/authStore";

const Settings = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            console.log("Account deleted");
            Alert.alert("Account delete request sent successfuly");
            logout();
          },
        },
      ]
    );
  };

  return (
    <View
      className="items-center flex-1"
      style={{
        flexGrow: 1,
        backgroundColor: "#262422",
      }}
    >
      <View className="flex-row items-center justify-between w-full px-3 py-2">
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="w-full h-full"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
      </View>
      <View className="flex-1 px-4 py-6 w-full pt-0">
        <View className="bg-[#33302E] rounded-lg p-6 items-center justify-center">
          <Text className="text-2xl font-bold text-[#FFD700]">Settings</Text>
        </View>
        <View className="mt-6 w-full">
          <Pressable
            className="bg-[#33302E] border-2 border-[#FF0000] rounded-lg py-3 px-4 mb-4"
            onPress={handleDeleteAccount}
          >
            <Text className="text-lg font-medium text-[#FF0000]">
              Delete Account
            </Text>
          </Pressable>
          <Pressable
            className="bg-[#33302E] border-2 border-[#00FF00] rounded-lg py-3 px-4"
            onPress={logout}
          >
            <Text className="text-lg font-medium text-[#00FF00]">Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Settings;
