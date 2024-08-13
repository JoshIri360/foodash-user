import FlexibleInput from "@/components/inputs/flexibleInput";
import { useAuthStore } from "@/context/authStore";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { s, vs } from "react-native-size-matters";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSignIn = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password cannot be empty");
      return;
    }

    try {
      setLoading(true);
      let response = await login(email, password);
      console.log(response);
      setLoading(false);
    } catch (err: any) {
      setError(JSON.stringify(err));
      setLoading(false);
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
        <Text
          className="text-[#005C2D]"
          style={{
            fontFamily: "ArchivoMedium",
            fontSize: 30,
            lineHeight: 36,
          }}
        >
          Welcome Back
        </Text>
        <Text
          className="text-[#005C2D] text-sm"
          style={{
            fontFamily: "ManropeMedium",
            width: "80%",
          }}
        >
          Enter your credentials to login and access your account.
        </Text>
        <View className="mt-20">
          <FlexibleInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            icon="envelope"
          />
          <FlexibleInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            icon="key"
          />
        </View>
        <Link href="/forgotPassword" asChild>
          <Text
            className="text-[#005C2D] self-end text-sm"
            style={{
              fontFamily: "ArchivoMedium",
            }}
          >
            Forgot password?
          </Text>
        </Link>
        {
          <Text
            className="text-red-500 text-sm"
            style={{
              paddingTop: vs(8),
            }}
          >
            {error}
          </Text>
        }

        <View className="w-full">
          <TouchableOpacity
            className="bg-[#005C2D] justify-center items-center rounded-md"
            style={{
              paddingVertical: vs(12),
            }}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text
              className="text-white "
              style={{
                fontFamily: "ManropeSemiBold",
                fontSize: 16,
                lineHeight: 19,
              }}
            >
              {loading ? "Loading..." : "Continue"}
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-8">
            <Text
              className="text-[#727272]"
              style={{
                fontFamily: "ManropeMedium",
              }}
            >
              Don't Have an account yet?{" "}
            </Text>
            <Link href="/createAccount" asChild>
              <Text
                className="text-black"
                style={{
                  fontFamily: "ManropeSemiBold",
                }}
              >
                Sign up.
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
