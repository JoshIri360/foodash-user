import React from "react";
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import RestuarantItem from "@/components/RestuarantItem";
import { Restaurant } from "@/types/Restaurant";

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  onRefresh: () => void;
  onRestaurantPress: (restaurant: Restaurant) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  isLoading,
  onRefresh,
  onRestaurantPress,
}) => {
  if (isLoading || restaurants.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <RestuarantItem restaurant={item} handlePress={onRestaurantPress} />
      )}
      initialNumToRender={10}
    />
  );

  // return (
  //   <ScrollView
  //     refreshControl={
  //       <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
  //     }
  //   >
  //     {restaurants.map((item) => (
  //       <RestuarantItem
  //         key={item.id}
  //         restaurant={item}
  //         handlePress={onRestaurantPress}
  //       />
  //     ))}
  //   </ScrollView>
  // );
};

export default RestaurantList;
