import CustomInput from "@/components/CustomInput";
import { useAuthStore } from "@/context/authStore";
import useCartStore from "@/context/cartStore";
import useOrderStore from "@/context/orderStore";
import { db } from "@/firebaseConfig";
import { Entypo } from "@expo/vector-icons";
import {
  Link,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import RNPickerSelect from "react-native-picker-select";
import { useUniversityStore } from "@/context/universityStore";

export default function Location() {
  const { carts } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  const { balance, restaurantId } = useLocalSearchParams<any>();
  const [deliveryFee, setDeliveryFee] = React.useState(0);
  const [locationError, setLocationError] = React.useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = React.useState(false);
  const [locations, setLocations] = React.useState<
    Array<{ label: string; value: string; fee: number }>
  >([]);
  const [selectedLocation, setSelectedLocation] = React.useState<string | null>(
    null
  );
  const [serviceCharge, setServiceCharge] = React.useState<number>(0);
  const [address, setAddress] = React.useState("");
  const [addressError, setAddressError] = React.useState(false);

  const pathname = usePathname();
  const router = useRouter();

  let totalAmount: any = undefined;

  const getUniversityId = async () => {
    if (!user) return;
    const uid = user.uid;
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    return userData?.selectedUniversity;
  };

  const getUniverstyLocations = async () => {
    const universityId = await getUniversityId();
    if (!universityId) return;
    const universityRef = doc(db, "universities", universityId);
    const universityDoc = await getDoc(universityRef);
    const universityData = universityDoc.data();
    return universityData?.locations;
  };

  const getUniversityServiceCharge = async () => {
    const universityId = await getUniversityId();
    if (!universityId) return;
    const universityRef = doc(db, "universities", universityId);
    const universityDoc = await getDoc(universityRef);
    const universityData = universityDoc.data();
    return universityData?.serviceCharge;
  };

  useEffect(() => {
    try {
      getUniverstyLocations().then((locationsData) => {
        if (locationsData) {
          const formattedLocations = Object.entries(locationsData).map(
            ([key, value]) => ({
              label: `${key}`,
              value: key,
              fee: Number(value),
            })
          );
          setLocations(formattedLocations);
          if (formattedLocations.length > 0) {
            setSelectedLocation(formattedLocations[0].value);
            setDeliveryFee(formattedLocations[0].fee);
          }
        }
      });
    } catch (e) {
      console.log("Error getting university locations", e);
    }
  }, []);

  useEffect(() => {
    try {
      getUniversityServiceCharge().then((serviceChargeData) => {
        if (serviceChargeData) {
          setServiceCharge(serviceChargeData);
        }
      });
    } catch (e) {
      console.log("Error getting university service charge", e);
    }
  }, []);

  const getTotalAmount = (
    carts: { price: number; quantity: number; restaurantId: string }[]
  ) => {
    const filteredCarts = carts.filter(
      (cart) => cart.restaurantId === restaurantId
    );

    const subtotal = filteredCarts.reduce(
      (acc, o) => acc + o.price * o.quantity,
      0
    );
    return subtotal + deliveryFee + serviceCharge;
  };

  const _carts = carts.filter((cart) => cart.restaurantId === restaurantId);

  const handleContinue = async () => {
    if (isProcessingOrder) {
      return;
    }

    if (!selectedLocation) {
      setLocationError(true);
      return;
    }

    if (address.trim().length === 0) {
      setAddressError(true);
      return;
    }

    setLocationError(false);
    setAddressError(false);
    setIsProcessingOrder(true);
    try {
      const result = await createOrder(
        `${selectedLocation} - ${address}`,
        restaurantId,
        totalAmount
      );
      if (result.success) {
        router.navigate("/success");
      } else {
        console.error(result.error);
      }
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <>
      <View className="flex-row items-center justify-between w-full px-3 py-1">
        <Pressable onPress={() => router.back()}>
          <Entypo name="chevron-left" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-lg">Location</Text>
        <View className="w-8"></View>
      </View>
      <View className="flex-1 justify-between">
        <View
          style={{
            paddingHorizontal: s(20),
            marginTop: vs(20),
          }}
        >
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedLocation(value);
              const selectedLocationData = locations.find(
                (loc) => loc.value === value
              );
              if (selectedLocationData) {
                setDeliveryFee(selectedLocationData.fee);
              }
            }}
            items={locations}
            style={{
              inputIOS: {
                fontSize: 16,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 4,
                color: "black",
                paddingVertical: 12,
                paddingHorizontal: 10,
                marginBottom: vs(10),
                backgroundColor: "white",
              },
              inputAndroid: {
                fontSize: 16,
                borderWidth: 0.5,
                borderColor: "purple",
                borderRadius: 8,
                color: "black",
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: "white",
              },
            }}
            value={selectedLocation}
            placeholder={{
              label: "Select Location",
              value: null,
              fee: 0,
            }}
          />
          {locationError && (
            <Text className="text-red-500" style={{ marginBottom: vs(10) }}>
              Please select a location
            </Text>
          )}

          <CustomInput
            placeholder="Enter your specific address"
            onChangeText={(text: string) => setAddress(text)}
            value={address}
          />
          {addressError && (
            <Text className="text-red-500" style={{ marginTop: vs(10) }}>
              Please enter your specific address
            </Text>
          )}
        </View>
        <View className="flex-1"></View>
        <View
          className="w-full flex-row justify-between"
          style={{ marginVertical: vs(20) }}
        >
          <View
            className="bg-white justify-center"
            style={{ padding: s(5), paddingHorizontal: s(10) }}
          >
            <Text className="text-black">
              Cart Total: N
              <Text className="text-black">
                {getTotalAmount(_carts) - deliveryFee - serviceCharge}
              </Text>
            </Text>
            <Text className="text-black">
              Delivery Fee: N<Text className="text-black">{deliveryFee}</Text>
            </Text>
            <Text className="text-black">
              Service Charge: N
              <Text className="text-black">{serviceCharge}</Text>
            </Text>
            <Text className="text-black">
              Total Amount: N
              <Text className="text-black">{getTotalAmount(_carts)}</Text>
            </Text>
            <Text
              className={`font-semibold ${
                getTotalAmount(_carts) > balance ? "text-red-500" : "text-black"
              }`}
            >
              Balance: N<Text>{balance}</Text>
            </Text>
          </View>
          {totalAmount > balance && balance != undefined && (
            <Link
              href={`/fundWallet?suggestedAmount=${totalAmount}&previousRoute=${pathname}`}
              asChild
            >
              <Pressable className="bg-black items-center justify-center self-end py-3 px-5 rounded-l-full">
                <Text className="text-red-500 text-lg">FUND WALLET</Text>
              </Pressable>
            </Link>
          )}
          {totalAmount <= balance && balance != undefined && (
            <Pressable
              className="bg-[#05B817] items-center justify-center self-end py-3 px-5 rounded-l-full"
              onPress={handleContinue}
              disabled={isProcessingOrder}
            >
              <Text className="text-white text-lg">
                {isProcessingOrder ? "PROCESSING..." : "CONTINUE"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}
