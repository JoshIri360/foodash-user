import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const FlexibleInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  icon?: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor="#A8A8A8"
        />
        {icon && (
          <FontAwesome6
            name={icon}
            size={16}
            color="#9D9D9D"
            style={styles.icon}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  label: {
    fontFamily: "ArchivoMedium",
    color: "#005C2D",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#A8A8A8",
    borderRadius: 8,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    fontFamily: "ManropeSemiBold",
    color: "black",
    padding: 12,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 12,
  },
});

export default FlexibleInput;
