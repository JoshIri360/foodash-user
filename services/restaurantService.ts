import { db } from "@/firebaseConfig";
import { Restaurant } from "@/types/Restaurant";
import {
  collection,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const docToRestaurant = (doc: DocumentData): Restaurant => ({
  id: doc.id,
  name: doc.data().restaurantName || "Unnamed Restaurant",
  coverImage: doc.data().coverImage || "",
  endTime: doc.data().endTime ? new Date(doc.data().endTime) : new Date(),
  iconImage: doc.data().iconImage || "",
  mealCategories: doc.data().mealCategories || [],
  mealPreparationTime: doc.data().mealPreparationTime || { high: 0, low: 0 },
  startTime: doc.data().startTime ? new Date(doc.data().startTime) : new Date(),
  uniId: doc.data().uniId || "",
  open: doc.data().open || false,
});

const getUserSelectedUniversity = async (userData: any, isGuest: boolean) => {
  if (isGuest) return "usBctdXyQqLHxHSWBZSC";
  if (!userData) throw new Error("User data is not available");
  const selectedUniversity = userData.selectedUniversity;

  if (!selectedUniversity)
    throw new Error("Selected university is not set for the user");

  return selectedUniversity;
};

export const fetchRestaurants = async (userData: any, isGuest: boolean) => {
  try {
    const userSelectedUniversity = await getUserSelectedUniversity(
      userData,
      isGuest
    );

    const q = query(
      collection(db, "restaurants"),
      where("selectedUniversity", "==", userSelectedUniversity)
    );

    const querySnapshot = await getDocs(q);
    const restaurantsData: Restaurant[] =
      querySnapshot.docs.map(docToRestaurant);

    const uniqueCategories = new Set<string>();
    restaurantsData.forEach((restaurant) => {
      restaurant.mealCategories.forEach((category) => {
        uniqueCategories.add(category);
      });
    });

    return {
      restaurantsData,
      uniqueCategories: Array.from(uniqueCategories),
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export const subscribeToRestaurants = (
  setRestaurants: (restaurants: Restaurant[]) => void,
  userData: any,
  isGuest: boolean
) => {
  let unsubscribe: (() => void) | undefined;

  const subscribe = async () => {
    try {
      const userSelectedUniversity = await getUserSelectedUniversity(
        userData,
        isGuest
      );
      const q = query(
        collection(db, "restaurants"),
        where("selectedUniversity", "==", userSelectedUniversity)
      );

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const restaurantsData: Restaurant[] =
          querySnapshot.docs.map(docToRestaurant);
        setRestaurants(restaurantsData);
      });
    } catch (error) {
      console.error("Error setting up restaurant subscription:", error);
    }
  };

  subscribe();

  return () => {
    if (unsubscribe) unsubscribe();
  };
};
