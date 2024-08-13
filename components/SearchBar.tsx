import React from "react";
import { View, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { vs } from "react-native-size-matters";

const SearchBar = () => {
  return (
    <View className="relative w-full px-3" style={{
        marginVertical: vs(10),
        marginBottom: vs(7),
    }}>
      <TextInput
        placeholder="Search restaurants"
        className="w-full h-[40px] bg-[#F6F6F6] rounded-lg"
        style={{
          padding: 0,
          paddingLeft: 10,
          fontFamily: "SenRegular",
        }}
      />
      <MaterialIcons
        name="search"
        size={24}
        color="#A0A5BA"
        style={{
          position: "absolute",
          right: 16,
          top: 8,
        }}
      />
    </View>
  );
};

export default SearchBar;
