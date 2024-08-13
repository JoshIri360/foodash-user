import { useLocationStore } from "@/context/locationStore";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const WithdrawalSheet = ({
  setLocation,
  setShouldFetchOrderDetails,
  exactAddress,
  totalAmount,
  setExactAddress,
  setBreakdownAlert,
  setErrorMessage,
  setErrorAlert,
  location,
}: {
  setLocation: any;
  setShouldFetchOrderDetails: any;
  exactAddress: any;
  totalAmount: any;
  setExactAddress: any;
  setBreakdownAlert: any;
  setErrorMessage: any;
  setErrorAlert: any;
  location: any;
}) => {
  const router = useRouter();
  const { locations } = useLocationStore();

  useEffect(() => {
    if (locations && locations.length > 0) {
      console.log("Locations", locations);
      setLocation(locations[0].id);
      setShouldFetchOrderDetails(true);
    }
  }, [locations]);

  return (
    <View className="px-3 justify-between items-center h-full pb-6 w-full">
      <View className="w-full">
        <Text className="uppercase text-[#A0A5BA] mb-1">Major Address</Text>
        <View
          style={{
            backgroundColor: "#F0F5FA",
            marginBottom: 8,
            borderRadius: 8,
          }}
        >
          <Picker
            selectedValue={location}
            onValueChange={(itemValue) => {
              setLocation(itemValue);
              setShouldFetchOrderDetails(true);
            }}
            style={{ color: "#32343E" }}
          >
            {locations[0].price &&
              (locations || []).map((location, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={`${location.name} - ₦${location.price}`}
                    value={location.id}
                  />
                );
              })}
          </Picker>
        </View>
        <Text className="uppercase text-[#A0A5BA] mb-1 mt-2">
          Exact Address
        </Text>
        <TextInput
          placeholder="Enter your address"
          style={{
            backgroundColor: "#F0F5FA",
            marginBottom: 8,
            borderRadius: 8,
            padding: 10,
            paddingHorizontal: 12,
          }}
          value={exactAddress}
          onChangeText={setExactAddress}
        />
        <View className="py-3 flex-row items-center justify-between">
          <View className="flex-row">
            <Text className="uppercase text-[#A0A5BA] mb-1 mt-2">Total: </Text>
            <Text className="text-2xl text-black font-semibold">
              ₦{totalAmount}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setBreakdownAlert(true)}>
            <Text className="text-[#34A853] text-lg">Breakdown</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (!exactAddress) {
            setErrorMessage("Please enter your address");
            setErrorAlert(true);
            return;
          } else if (!location) {
            setErrorMessage("Please select a location");
            setErrorAlert(true);
            return;
          }

          router.push({
            pathname: "/paystackCheckout",
            params: {
              amount: totalAmount,
              address: exactAddress,
            },
          });
        }}
        className="w-full bg-[#34A853] items-center justify-center py-3 rounded-lg"
      >
        <Text className="font-bold text-white text-base uppercase">
          Proceed to make payment
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WithdrawalSheet;
