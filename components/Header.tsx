import { useAuthStore } from "@/context/authStore";
import { useUniversityStore } from "@/context/universityStore";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { vs } from "react-native-size-matters";

interface Location {
  id: string;
  name: string;
  price?: number;
}

const Header = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();
  const { currentUniversity } = useUniversityStore();
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("lastOrderLocation").then((location) => {
      console.log("Location", location);
      setLocation(JSON.parse(location || "{}"));
    });
  }, []);

  return (
    <View className="flex-row items-center justify-between w-full px-3 pt-3">
      <View className="flex-row space-x-3 items-center justify-center">
        <Pressable
          onPress={() => navigation?.openDrawer()}
          className="bg-[#ECF0F4] aspect-square rounded-full items-center justify-center"
          style={{ height: vs(30) }}
        >
          <Feather name="menu" size={20} color="#181C2E" />
        </Pressable>
        <View>
          <Text
            className="uppercase text-[#00A36C] text-xs"
            style={{ fontFamily: "SenBold" }}
          >
            DELIVER TO
          </Text>
          <View className="items-center justify-center flex-row">
            <Text
              className="text-[#676767] dark:text-white"
              style={{ fontSize: 14, fontFamily: "SenRegular", lineHeight: 14 }}
            >
              {location?.name ||
                Object.keys(currentUniversity?.locations || {})[0]}
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={logout}
        className="bg-[#1A2424] aspect-square rounded-full items-center justify-center"
        style={{ height: vs(30) }}
      >
        <MaterialIcons name="logout" size={20} color="#fff" />
      </Pressable>
    </View>
  );
};

export default Header;
