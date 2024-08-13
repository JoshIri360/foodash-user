import FlexibleInput from "@/components/inputs/flexibleInput";
import { useOnboardingStore } from "@/context/onboardingStore";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { s, vs } from "react-native-size-matters";

const CreateAccount = () => {
  const name = useOnboardingStore((state) => state.name);
  const setName = useOnboardingStore((state) => state.setName);
  const email = useOnboardingStore((state) => state.email);
  const setEmail = useOnboardingStore((state) => state.setEmail);
  const [pressed, setPressed] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if ((!name && pressed) || (!email && pressed)) {
      setError("Name and Email cannot be empty");
      return;
    } else if (
      (!email.includes("@") && pressed) ||
      (!email.includes(".") && pressed)
    ) {
      setError("Invalid email address");
      return;
    } else {
      setError("");
    }
  }, [name, email, pressed]);

  const handleProceed = () => {
    if (!name || !email || !email.includes("@") || !email.includes(".")) return;
    router.push({
      pathname: "/createPassword",
      params: {
        name,
        email,
      },
    });
  };

  return (
    <View
      className="flex-1 items-center justify-between"
      style={{
        paddingTop: vs(60),
        paddingBottom: vs(20),
        paddingHorizontal: s(20),
      }}
    >
      <View className="w-full">
        <Text className="text-sm" style={{ fontFamily: "ManropeMedium" }}>
          Create an Account
        </Text>
        <Text
          className="text-[#005C2D]"
          style={{
            fontFamily: "ArchivoMedium",
            width: "80%",
            fontSize: 30,
            lineHeight: 36,
          }}
        >
          Name and Email.
        </Text>
        <View className="mt-20">
          <FlexibleInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Name"
            icon="user"
          />
          <FlexibleInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            icon="envelope"
          />
        </View>
        {error && (
          <Text className="text-red-500 text-sm" style={{ paddingTop: vs(8) }}>
            {error}
          </Text>
        )}
      </View>
      <View className="w-full">
        <View className="flex-row justify-center mt-8">
          <Text
            className="text-[#727272]"
            style={{
              fontFamily: "ManropeMedium",
            }}
          >
            Already have an account?{" "}
          </Text>
          <Link href="/signIn" asChild>
            <Text
              className="text-black"
              style={{
                fontFamily: "ManropeSemiBold",
              }}
            >
              Log in.
            </Text>
          </Link>
        </View>
        <TouchableOpacity
          className="bg-[#005C2D] justify-center items-center rounded-md"
          style={{ paddingVertical: vs(12), marginTop: vs(20) }}
          onPress={() => {
            setPressed(true);
            handleProceed();
          }}
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
    </View>
  );
};

export default CreateAccount;
