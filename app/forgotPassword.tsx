import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { s, vs } from "react-native-size-matters";
import CustomInput from "@/components/CustomInput";
import { Link } from "expo-router";
import { useAuthStore } from "@/context/authStore";

export default function forgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    "A password reset link will be sent to your email"
  );

  const { resetPassword } = useAuthStore();

  const handleResetPassword = async () => {
    setLoading(true);
    if (!email) {
      console.log("Email cannot be empty");
      setLoading(false);
      return;
    }

    try {
      let response = await resetPassword(email);

      if (response.data.includes("auth/user-not-found")) {
        console.log("User not found");
        setLoading(false);
      }

      setMessage("A password reset link has been sent to your email");
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      setError("An error occured");
    }
  };

  return (
    <View
      className="flex-1 items-center justify-between"
      style={{
        paddingVertical: vs(40),
      }}
    >
      <View
        style={{
          paddingHorizontal: s(20),
        }}
        className="w-full"
      >
        <Text className="text-white text-lg">Reset Password</Text>
        <CustomInput
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text: string) => setEmail(text)}
        />
        {error && (
          <Text
            className="text-red-500 text-sm"
            style={{
              marginTop: vs(10),
            }}
          >
            {error}
          </Text>
        )}
        {!error && message && (
          <Text
            className="text-green-500 text-sm"
            style={{
              marginTop: vs(10),
            }}
          >
            {message}
          </Text>
        )}
      </View>
      <View className="w-full">
        <TouchableOpacity
          className="bg-[#05B817] items-center justify-center self-end py-3 px-5 rounded-l-full w-[35vw]"
          style={{
            marginTop: vs(20),
          }}
          disabled={loading}
          onPress={handleResetPassword}
        >
          <Text className="text-white text-lg">
            {loading ? "Loading..." : "Continue"}
          </Text>
        </TouchableOpacity>
        <Link href="/signUp" asChild>
          <Text
            className="self-end text-white"
            style={{
              paddingHorizontal: s(20),
              paddingTop: vs(8),
            }}
          >
            Don't have an account?{" "}
            <Text className="text-[#05B817]">Sign up</Text>
          </Text>
        </Link>
      </View>
    </View>
  );
}
