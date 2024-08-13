import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";

export default function CustomInput({
  placeholder,
  password = false,
  secureTextEntry,
  toggleVisibility,
  ...props
}: {
  placeholder: string;
  password?: boolean;
  secureTextEntry?: boolean;
  toggleVisibility?: () => void;
  [key: string]: any;
}) {
  return (
    <View
      style={{
        marginTop: vs(20),
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        {...props}
        secureTextEntry={secureTextEntry}
        style={{
          flex: 1,
          paddingVertical: vs(10),
          paddingHorizontal: s(20),
        }}
        placeholder={placeholder}
        placeholderTextColor={"#A0A3BD"}
        className="bg-white w-full rounded-2xl"
      />
      {secureTextEntry && password && (
        <TouchableOpacity
          onPress={toggleVisibility}
          className="absolute right-4"
        >
          <Text>Show</Text>
        </TouchableOpacity>
      )}
      {!secureTextEntry && password && (
        <TouchableOpacity
          onPress={toggleVisibility}
          className="absolute right-4"
        >
          <Text>Hide</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
