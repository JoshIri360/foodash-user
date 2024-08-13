import FlexibleInput from "@/components/inputs/flexibleInput";
import { useOnboardingStore } from "@/context/onboardingStore";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { s, vs } from "react-native-size-matters";

const CreatePassword = () => {
  const password = useOnboardingStore((state) => state.password);
  const setPassword = useOnboardingStore((state) => state.setPassword);
  const confirmPassword = useOnboardingStore((state) => state.confirmPassword);
  const setConfirmPassword = useOnboardingStore(
    (state) => state.setConfirmPassword
  );
  const [log, setLog] = useState("");
  const [error, setError] = useState("");
  const name = useOnboardingStore((state) => state.name);
  const email = useOnboardingStore((state) => state.email);
  const router = useRouter();

  const handleProceed = () => {
    if (!password || !confirmPassword) {
      setError("Password fields cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    router.push({
      pathname: "/enterProfileInfo",
      params: {
        password,
        name,
        email,
      },
    });
  };

  useEffect(() => {
    if (
      password === confirmPassword &&
      password &&
      confirmPassword &&
      !error &&
      !log &&
      password.length >= 6
    ) {
      setLog("Passwords Match");
    } else if (password !== confirmPassword) {
      setLog("");
    }
  }, [password, confirmPassword]);

  return (
    <View
      className="flex-1 items-center justify-between"
      style={{
        paddingTop: vs(32),
        paddingBottom: vs(20),
        paddingHorizontal: s(20),
      }}
    >
      <View className="w-full">
        <View
          style={{
            height: vs(28),
          }}
        >
          <Link href="/createAccount" asChild>
            <Feather name="arrow-left-circle" size={24} color="black" />
          </Link>
        </View>
        <Text className="text-sm" style={{ fontFamily: "ManropeMedium" }}>
          Create an Account
        </Text>
        <Text
          className="text-[#005C2D]"
          style={{
            fontFamily: "ArchivoMedium",
            fontSize: 30,
            lineHeight: 36,
          }}
        >
          Create Password
        </Text>
        <View className="mt-20">
          <FlexibleInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            icon="key"
          />
          <FlexibleInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry
            icon="key"
          />
        </View>
        {error && (
          <Text
            className="text-red-500 text-sm"
            style={{ paddingTop: vs(8), fontFamily: "ManropeSemiBold" }}
          >
            {error}
          </Text>
        )}
        {log && (
          <View
            className="flex-row items-center"
            style={{
              paddingTop: vs(8),
            }}
          >
            <FontAwesome5
              name="check-circle"
              size={20}
              color="rgb(34,197,94)"
            />
            <Text
              className="text-green-500 text-sm"
              style={{
                marginLeft: s(4),
                fontFamily: "ManropeSemiBold",
              }}
            >
              {log}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        className="bg-[#005C2D] justify-center items-center rounded-md w-full"
        style={{
          paddingVertical: vs(12),
          marginTop: vs(20),
          backgroundColor: log ? "#005C2D" : "rgba(0,92,45,0.5)",
        }}
        onPress={handleProceed}
        disabled={!log}
      >
        <Text
          className="text-white"
          style={{
            fontFamily: "ManropeSemiBold",
            fontSize: 16,
            lineHeight: 19,
          }}
        >
          Proceed
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreatePassword;
