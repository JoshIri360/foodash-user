import CustomInput from "@/components/CustomInput";
import { useAuthStore } from "@/context/authStore";
import { db } from "@/firebaseConfig";
import { Link } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { s, vs } from "react-native-size-matters";

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([] as any[]);

  const { register, fetchUserData } = useAuthStore();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      const universitiesCollection = collection(db, "universities");
      const universitiesSnapshot = await getDocs(universitiesCollection);
      const universitiesData = universitiesSnapshot.docs.map((doc) => {
        return {
          label: doc.data().name,
          value: doc.id,
        };
      });
      console.log(universitiesData);
      setUniversities(universitiesData);
    };

    fetchUniversities();
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    if (
      !username ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword ||
      !selectedUniversity
    ) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const response = await register({
      username,
      phoneNumber,
      email,
      password,
      selectedUniversity,
    });

    if (response.success) {
      console.log(response.data.uid);
      await fetchUserData(response.data.uid);
    } else {
      setError(response.data);
      if (response.data.includes("auth/email-already-in-use")) {
        setError("Email is already registered, sign in instead");
      }
    }
  };

  return (
    <View
      className="flex-1 items-center justify-between"
      style={{
        paddingVertical: vs(40),
      }}
    >
      <Text className="text-3xl text-green-500 font-bold">Welcome!</Text>
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
      <View
        style={{
          paddingHorizontal: s(20),
        }}
        className="w-full"
      >
        <Text className="text-white text-lg">SIGN UP</Text>
        <Text className="text-white">Please provide the following details</Text>
        <CustomInput
          placeholder="Username"
          onChangeText={(text: string) => setUsername(text)}
          value={username}
        />
        <CustomInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          onChangeText={(text: string) => setPhoneNumber(text)}
          value={phoneNumber}
        />
        <CustomInput
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
        />
        <CustomInput
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          toggleVisibility={togglePasswordVisibility}
          onChangeText={(text: string) => setPassword(text)}
          password
          value={password}
        />
        <CustomInput
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible}
          toggleVisibility={toggleConfirmPasswordVisibility}
          onChangeText={(text: string) => setConfirmPassword(text)}
          password
          value={confirmPassword}
        />
        <View
          className="w-full rounded-2xl bg-white"
          style={{
            marginTop: vs(20),
          }}
        >
          <RNPickerSelect
            onValueChange={(value) => setSelectedUniversity(value)}
            items={universities}
            style={{
              inputIOS: {
                fontSize: 16,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 4,
                color: "black",
                paddingVertical: 12,
              },
              inputAndroid: {
                fontSize: 16,
                borderWidth: 0.5,
                borderColor: "purple",
                borderRadius: 8,
                color: "black",
              },
            }}
            value={selectedUniversity}
            placeholder={{
              label: "Select University",
              value: null,
            }}
          />
        </View>
      </View>
      <View className="w-full">
        <TouchableOpacity
          className="bg-[#05B817] items-center justify-center self-end py-3 px-5 rounded-l-full w-[35vw]"
          onPress={handleSignUp}
          style={{
            marginTop: vs(20),
          }}
          disabled={loading}
        >
          <Text className="text-white text-lg">
            {loading ? "Loading..." : "Sign up"}
          </Text>
        </TouchableOpacity>
        <Link href="/signIn" asChild>
          <Text
            className="self-end text-white"
            style={{
              paddingHorizontal: s(20),
              paddingTop: vs(8),
            }}
          >
            Already have an account?{" "}
            <Text className="text-[#05B817]">Sign in</Text>
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
