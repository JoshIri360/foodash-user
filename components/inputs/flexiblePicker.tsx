import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo vector icons

const FlexiblePicker = ({
  label,
  selectedValue,
  onValueChange,
  items,
  tooltipText,
}: {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  items: { label: string; value: string }[];
  tooltipText?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <View className="relative">
          {tooltipText && (
            <TouchableOpacity
              onPress={handleTooltipToggle}
              style={styles.tooltipIcon}
            >
              <Ionicons name="help-circle-outline" size={20} color="#005C2D" />
            </TouchableOpacity>
          )}
        </View>
        {showTooltip && tooltipText && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{tooltipText}</Text>
          </View>
        )}
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "ArchivoMedium",
    color: "#005C2D",
  },
  tooltipIcon: {
    marginLeft: 5,
  },
  tooltip: {
    position: "absolute",
    bottom: 25,
    left: 0,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1,
  },
  tooltipText: {
    fontFamily: "ArchivoRegular",
    fontSize: 12,
    color: "#333",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#A8A8A8",
    borderRadius: 8,
    backgroundColor: "white",
    marginTop: 5,
  },
  picker: {
    flex: 1,
    fontFamily: "ManropeSemiBold",
    color: "black",
  },
});

export default FlexiblePicker;
