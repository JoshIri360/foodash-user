import FlexibleInput from "@/components/inputs/flexibleInput";
import FlexiblePicker from "@/components/inputs/flexiblePicker";
import { useAuthStore } from "@/context/authStore";
import { useLocationStore } from "@/context/locationStore";
import { useOnboardingStore } from "@/context/onboardingStore";
import { db } from "@/firebaseConfig";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { s, vs } from "react-native-size-matters";

const EnterProfileInfo = () => {
  const [university, setUniversity] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const { register, fetchUserData } = useAuthStore();
  const name = useOnboardingStore((state) => state.name);
  const email = useOnboardingStore((state) => state.email);
  const password = useOnboardingStore((state) => state.password);

  const setPhoneNumberValidation = (value: string) => {
    const regex = /^[0-9]*$/;
    if (!regex.test(value) || value.length > 11) {
      return;
    }
    setPhoneNumber(value);
  };

  const [universities, setUniversities] = useState<
    { label: string; value: string }[]
  >([]);
  const { locations, setLocationsForUniversity } = useLocationStore();

  useEffect(() => {
    const fetchUniversities = async () => {
      const universitiesCollection = collection(db, "universities");
      const universitiesSnapshot = await getDocs(universitiesCollection);
      const universitiesData = universitiesSnapshot.docs.map((doc) => ({
        label: doc.data().name,
        value: doc.id,
      }));
      setUniversities(universitiesData);
      return universitiesData;
    };

    fetchUniversities().then((universities) => {
      setUniversity(universities[0]?.value);
      if (locations.length > 0 && locations[0] !== undefined) {
        setAddress(locations[0]?.id);
        AsyncStorage.setItem("lastOrderLocation", JSON.stringify(locations[0]));
      }
    });
  }, []);

  useEffect(() => {
    if (university) {
      setLocationsForUniversity(university);
    }
  }, [university]);

  const handleCreateAccount = async () => {
    if (
      !university ||
      !address ||
      !phoneNumber ||
      !name ||
      !email ||
      !password
    ) {
      return;
    }

    const response = await register({
      username: name,
      phoneNumber,
      email,
      password,
      selectedUniversity: university,
    });

    if (response.success) {
      console.log(response.data.uid);
      await fetchUserData(response.data.uid);
    } else {
      if (response.data.includes("auth/email-already-in-use")) {
        setError("Email is already registered, sign in instead");
      } else {
        setError("An error occurred, please try again");
      }
    }
  };

  return (
    <ScrollView
      style={{
        paddingTop: vs(32),
        paddingBottom: vs(20),
        paddingHorizontal: s(20),
      }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View className="w-full">
        <View
          style={{
            height: vs(28),
          }}
        >
          <Link href="/createPassword" asChild>
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
          Enter Profile Information
        </Text>
        {universities.length > 0 ? (
          <View className="mt-20">
            <FlexiblePicker
              label="University"
              selectedValue={university}
              onValueChange={setUniversity}
              items={universities}
            />
            <FlexiblePicker
              label="Address"
              selectedValue={address}
              onValueChange={setAddress}
              items={locations.map((location) => ({
                label: location.name,
                value: location.id,
              }))}
              tooltipText="Your address can be changed during order"
            />
            <FlexibleInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumberValidation}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              icon="phone"
            />
            {error && (
              <Text
                className="text-red-500 text-sm"
                style={{ paddingTop: vs(8), fontFamily: "ManropeSemiBold" }}
              >
                {error}
              </Text>
            )}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#005C2D" />
          </View>
        )}
      </View>
      <TouchableOpacity
        className="bg-[#005C2D] justify-center items-center rounded-md w-full"
        style={{ paddingVertical: vs(12), marginTop: vs(20) }}
        onPress={handleCreateAccount}
      >
        <Text
          className="text-white"
          style={{
            fontFamily: "ManropeSemiBold",
            fontSize: 16,
            lineHeight: 19,
          }}
        >
          Create my Account
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EnterProfileInfo;
