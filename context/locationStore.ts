import { create } from "zustand";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/firebaseConfig";

interface Location {
  id: string;
  name: string;
  price?: number;
}

interface LocationStore {
  locations: Location[];
  lastOrderLocation: Location | null;
  setLocationsForRestaurant: (restaurantId: string) => Promise<void>;
  setLocationsForUniversity: (universityId: string) => Promise<void>;
  setLastOrderLocation: (locationId: string) => Promise<void>;
  getLastOrderLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  lastOrderLocation: null,

  setLocationsForRestaurant: async (restaurantId: string) => {
    try {
      const locationPricesRef = collection(db, "restaurant_location_prices");
      const locationsRef = collection(db, "locations");
      const priceSnapshot = await getDocs(
        query(locationPricesRef, where("restaurant_id", "==", restaurantId))
      );

      const locationPromises = priceSnapshot.docs.map(async (locationDoc) => {
        const locationData = locationDoc.data();
        const locationSnapshot = await getDoc(
          doc(locationsRef, locationData.location_id)
        );

        return {
          id: locationSnapshot.id,
          name: locationSnapshot.data()?.name,
          price: locationData.price,
        } as Location;
      });

      const locationsWithPrices = await Promise.all(locationPromises);

      console.log("locationsWithPrices", locationsWithPrices);
      set({ locations: locationsWithPrices });
    } catch (error) {
      console.error("Error fetching locations for restaurant:", error);
    }
  },

  setLocationsForUniversity: async (universityId: string) => {
    try {
      const locationsRef = collection(db, "locations");

      const locationsSnapshot = await getDocs(
        query(locationsRef, where("university_id", "==", universityId))
      );

      const locations = locationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      })) as Location[];

      set({ locations });
    } catch (error) {
      console.error("Error fetching locations for university:", error);
    }
  },

  setLastOrderLocation: async (locationId: string) => {
    try {
      const locationsRef = doc(db, "locations", locationId);
      const locationSnap = await getDoc(locationsRef);

      if (locationSnap.exists()) {
        const location = {
          id: locationSnap.id,
          name: locationSnap.data()?.name,
        } as Location;

        await AsyncStorage.setItem(
          "lastOrderLocation",
          JSON.stringify(location)
        );
        set({ lastOrderLocation: location });
      } else {
        console.error("No such location!");
      }
    } catch (error) {
      console.error("Error setting last order location:", error);
    }
  },

  getLastOrderLocation: async () => {
    try {
      const storedLocation = await AsyncStorage.getItem("lastOrderLocation");

      if (storedLocation) {
        set({ lastOrderLocation: JSON.parse(storedLocation) });
      } else if (useLocationStore.getState().locations.length > 0) {
        // If no location is stored, fallback to the first location available and store it.
        const defaultLocation = useLocationStore.getState().locations[0];
        set({ lastOrderLocation: defaultLocation });
        await AsyncStorage.setItem(
          "lastOrderLocation",
          JSON.stringify(defaultLocation)
        );
      }
    } catch (error) {
      console.error("Error retrieving last order location:", error);
    }
  },
}));
