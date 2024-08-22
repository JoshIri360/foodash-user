import CategoryList from "@/components/CategoryList";
import Header from "@/components/Header";
import RestaurantList from "@/components/RestaurantList";
import SearchBar from "@/components/SearchBar";
import { useAuthStore } from "@/context/authStore";
import { useLocationStore } from "@/context/locationStore";
import { useUniversityStore } from "@/context/universityStore";
import {
  fetchRestaurants,
  subscribeToRestaurants,
} from "@/services/restaurantService";
import { Restaurant } from "@/types/Restaurant";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function Home() {
  const { user, isGuest, userData, fetchUserData } = useAuthStore();
  const { setCurrentUniversity } = useUniversityStore();
  const { setLocationsForUniversity } = useLocationStore();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      if (!userData && !isGuest) {
        console.log("Waiting for user data...");
        return;
      }
      const { restaurantsData, uniqueCategories } = await fetchRestaurants(
        userData,
        isGuest
      );
      setRestaurants(restaurantsData);
      setCategories(["All", ...uniqueCategories]);
      setCurrentUniversity(userData?.selectedUniversity);
      console.log("Current uni", userData?.selectedUniversity)
      setLocationsForUniversity(userData?.selectedUniversity);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      Alert.alert("Error", "Failed to fetch restaurants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userData, isGuest, setCurrentUniversity]);

  useEffect(() => {
    if (user && !userData) {
      fetchUserData(user.uid);
    }
  }, [user, userData, fetchUserData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if ((userData && !isGuest) || isGuest) {
      const unsubscribe = subscribeToRestaurants(
        (updatedRestaurants) => {
          setRestaurants(updatedRestaurants);
          const uniqueCategories = [
            ...new Set(updatedRestaurants.flatMap((r) => r.mealCategories)),
          ];
          setCategories(["All", ...uniqueCategories]);
        },
        userData,
        isGuest
      );
      return () => unsubscribe();
    }
  }, [userData, isGuest]);

  const handleRestaurantPress = useCallback(
    (restaurant: Restaurant) => {
      if (!user || isGuest) {
        Alert.alert(
          "Access Restricted",
          "Please sign in to access this feature."
        );
        return;
      }

      if (!restaurant.open) {
        Alert.alert(
          "Restaurant Closed",
          `${restaurant.restaurantName} is currently closed.`
        );
        return;
      }

      router.push<any>(`/(app)/restaurant/${restaurant.id}`);
    },
    [user, isGuest, router]
  );

  const filteredRestaurants = useMemo(() => {
    if (activeCategory === "All") return restaurants;
    return restaurants.filter((restaurant) =>
      restaurant.mealCategories.includes(activeCategory)
    );
  }, [restaurants, activeCategory]);

  const handleCategoryPress = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  if (
    isLoading ||
    (categories.length == 1 && categories[0] == "All") ||
    restaurants.length == 0
  ) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-[#262422]">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="items-center flex-1 bg-white dark:bg-[#262422]">
      <Header />
      <SearchBar />
      <View>
        <CategoryList
          categories={categories}
          activeCategory={activeCategory}
          onCategoryPress={handleCategoryPress}
        />
      </View>
      <RestaurantList
        restaurants={filteredRestaurants}
        isLoading={isLoading}
        onRefresh={fetchData}
        onRestaurantPress={handleRestaurantPress}
      />
    </View>
  );
}
