import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebaseConfig";
import { useAuthStore } from "./authStore";
import useCartStore from "./cartStore";

interface CartItem {
  mealId: string;
  restaurantId: string;
  quantity: number;
  name: string;
  price: number;
  images: string[];
}

interface OrderStore {
  createOrder: (
    location: string,
    restaurantId: string,
    totalAmount: number
  ) => Promise<{ success: boolean; error?: any }>;
}

const useOrderStore = create<OrderStore>((set) => {
  let isCreatingOrder = false;

  return {
    createOrder: async (location, restaurantId, totalAmount) => {
      if (isCreatingOrder)
        return { success: false, error: "Order is already being processed" };

      const { user } = useAuthStore.getState();
      const { carts, clearCartForRestaurant } = useCartStore.getState();

      if (!user || carts.length === 0) {
        return { success: false, error: "No user or cart items" };
      }

      const userId = user.uid;
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("User not found");
        return { success: false, error: "User not found" };
      }

      const userDocData = userDoc.data();

      const restaurantCartItems = carts.filter(
        (item: CartItem) => item.restaurantId === restaurantId
      );

      if (restaurantCartItems.length === 0) {
        return {
          success: false,
          error: "No items in cart for this restaurant",
        };
      }

      isCreatingOrder = true;

      try {
        const newOrderRef = await addDoc(collection(db, "orders"), {
          userId,
          restaurantId,
          items: restaurantCartItems,
          location,
          pushToken: userDocData.pushToken || null,
          createdAt: serverTimestamp(),
          status: "pending",
          totalAmount,
        });

        await setDoc(
          userRef,
          {
            orders: [...(userDocData.orders || []), newOrderRef.id],
          },
          { merge: true }
        );

        clearCartForRestaurant(restaurantId);

        return { success: true };
      } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error };
      } finally {
        isCreatingOrder = false;
      }
    },
  };
});

export default useOrderStore;
