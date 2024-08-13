import { create } from "zustand";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface MealPreparationTime {
  high: number;
  low: number;
}

interface Meal {
  id: string;
  category: string;
  images: string[];
  name: string;
  price: number;
  available?: boolean;
}

interface Restaurant {
  id: string;
  coverImage: string;
  endTime: Date;
  iconImage: string;
  mealCategories: string[];
  mealPreparationTime: MealPreparationTime;
  restaurantName: string;
  startTime: Date;
  uniId: string;
  open: boolean;
  description?: string;
}

interface RestaurantStore {
  currentRestaurant: Restaurant | null;
  meals: Meal[];
  selectedCategory: string | undefined;
  setCurrentRestaurant: (restaurantId: string) => Promise<void>;
  clearCurrentRestaurant: () => void;
  fetchMeals: (restaurantId: string) => Promise<void>;
  setSelectedCategory: (category: string) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  currentRestaurant: null,
  meals: [],
  selectedCategory: undefined,
  setCurrentRestaurant: async (restaurantId: string) => {
    try {
      const docRef = doc(db, "restaurants", restaurantId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const restaurantData = docSnap.data() as Restaurant;
        set({ currentRestaurant: { ...restaurantData, id: restaurantId } });
        await get().fetchMeals(restaurantId);
      } else {
        console.error("No such restaurant!");
        set({
          currentRestaurant: null,
          meals: [],
          selectedCategory: undefined,
        });
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      set({ currentRestaurant: null, meals: [], selectedCategory: undefined });
    }
  },
  clearCurrentRestaurant: () =>
    set({ currentRestaurant: null, meals: [], selectedCategory: undefined }),
  fetchMeals: async (restaurantId: string) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, `restaurants/${restaurantId}/meals`)
      );
      const mealsData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Meal)
      );
      set({ meals: mealsData, selectedCategory: mealsData[0]?.category });
    } catch (error) {
      console.error("Error fetching meals:", error);
      set({ meals: [], selectedCategory: undefined });
    }
  },
  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),
}));
