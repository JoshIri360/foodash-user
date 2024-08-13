import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { s, vs } from "react-native-size-matters";

const RestuarantItem = ({
  restaurant,
  handlePress,
}: {
  restaurant: any;
  handlePress: (restaurant: any) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed");
        handlePress(restaurant);
      }}
      className="w-[95vw] rounded-xl"
      style={{
        marginBottom: vs(16),
        padding: s(8),
        backgroundColor: "#98A8B860",
      }}
    >
      <View>
        <View className="aspect-video  rounded-lg overflow-hidden relative">
          <Image
            source={{ uri: restaurant?.iconImage }}
            placeholder={{ uri: "https://placehold.co/600x400" }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>

        <View className="flex-row items-center mt-1.5">
          <Text
            className="text-black text-xl mt-2"
            style={{
              fontFamily: "SenRegular",
              lineHeight: 20,
              includeFontPadding: false,
            }}
          >
            {restaurant?.name}
          </Text>
          <View
            className="flex-row items-center justify-center border rounded-full px-2 py-0.5 ml-3"
            style={{
              borderColor: `${restaurant?.open ? "#34C759" : "#de332b"}`,
              backgroundColor: `${restaurant?.open ? "#34C759" : "#de332b"}`,
            }}
          >
            <Text
              className="text-sm text-white"
              style={{
                fontFamily: "SenBold",
              }}
            >
              {restaurant?.open ? "Open" : "Closed"}
            </Text>
          </View>
        </View>

        <Text
          className="text-[#3a3c43]"
          style={{
            fontSize: 14,
            lineHeight: 20,
            fontFamily: "SenRegular",
          }}
        >
          {restaurant?.mealCategories.join(" - ")}
        </Text>
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-row items-center justify-center">
          <AntDesign name="star" size={24} color="#00A36C" />
          <Text
            className="text-lg"
            style={{
              fontFamily: "SenBold",
              paddingLeft: 5,
            }}
          >
            4.7
          </Text>
        </View>
        <View className="flex-row items-center justify-center">
          <AntDesign name="clockcircle" size={24} color="#00A36C" />
          <Text
            className="text-lg"
            style={{
              fontFamily: "SenRegular",
              paddingLeft: 5,
            }}
          >
            20 min
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestuarantItem;
