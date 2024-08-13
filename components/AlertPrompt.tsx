import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

interface ButtonProps {
  onPress: () => void;
  text: string;
  backgroundColor: string;
}

interface AlertPromptProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  message?: string;
  buttons: ButtonProps[];
  onClose: () => void;
  overlayColor?: string;
  promptBackgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  messageColor?: string;
  buttonTextColor?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (text: string) => void;
}

const AlertPrompt: React.FC<AlertPromptProps> = ({
  visible,
  title,
  subtitle,
  message,
  buttons,
  onClose,
  overlayColor = "rgba(0, 0, 0, 0.5)",
  promptBackgroundColor = "#1A2424",
  titleColor = "#fff",
  subtitleColor = "#666",
  messageColor = "#fff",
  buttonTextColor = "#fff",
  inputPlaceholder,
  inputValue,
  onInputChange,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: overlayColor }}
      >
        <Animated.View
          className="w-full p-5 rounded-lg"
          style={{
            backgroundColor: promptBackgroundColor,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text
            className="text-lg font-bold text-left"
            style={{ color: titleColor }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-md mb-4" style={{ color: subtitleColor }}>
              {subtitle}
            </Text>
          )}
          {message && (
            <Text
              className="text-base mb-5"
              style={{ color: messageColor }}
            >
              {message}
            </Text>
          )}
          {onInputChange && (
            <TextInput
              className="border rounded p-2 mb-5 bg-[#21332A] text-white"
              style={{ borderColor: "#3F6351" }}
              placeholder={inputPlaceholder}
              placeholderTextColor="#3F6351"
              value={inputValue}
              onChangeText={onInputChange}
            />
          )}
          <View className="flex-row justify-end">
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                className="py-2 px-5 rounded ml-2"
                style={{ backgroundColor: button.backgroundColor }}
                onPress={() => {
                  button.onPress();
                  onClose();
                }}
              >
                <Text
                  className="text-base font-bold"
                  style={{ color: buttonTextColor }}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AlertPrompt;
