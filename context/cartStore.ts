import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebaseConfig";
import { useAuthStore } from "./authStore";

interface Cart {
  restaurantId: string;
  mealId: string;
  quantity: number;
  name: string;
  price: number;
  images: string[];
}

interface CartStore {
  carts: Cart[];
  addToCart: (cart: Cart) => Promise<void>;
  reduceCart: (mealId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartForRestaurant: (restaurantId: string) => void;
  removeMeal: (mealId: string) => Promise<void>;
  getCartsByRestaurant: () => { [restaurantId: string]: Cart[] };
  updateCartItemPrice: (mealId: string, newPrice: number) => Promise<void>;
}

const useCartStore = create<CartStore>((set, get) => ({
  carts: [],

  addToCart: async (cart) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const updatedCarts = [...get().carts];
    const existingCartIndex = updatedCarts.findIndex(
      (o) => o.mealId === cart.mealId
    );
    if (existingCartIndex !== -1) {
      updatedCarts[existingCartIndex].quantity += cart.quantity;
      updatedCarts[existingCartIndex].price = cart.price;
    } else {
      updatedCarts.push(cart);
    }

    set({ carts: updatedCarts });

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { carts: updatedCarts }, { merge: true });
    } catch (error) {
      console.error("Failed to update Firebase:", error);
      set({ carts: get().carts });
    }
  },

  reduceCart: async (mealId) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Update locally first
    const updatedCarts = [...get().carts];
    const cartIndex = updatedCarts.findIndex((o) => o.mealId === mealId);
    if (cartIndex !== -1) {
      if (updatedCarts[cartIndex].quantity > 1) {
        updatedCarts[cartIndex].quantity -= 1;
      } else {
        updatedCarts.splice(cartIndex, 1);
      }
    }
    set({ carts: updatedCarts });

    // Then update Firebase
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { carts: updatedCarts }, { merge: true });
    } catch (error) {
      // If Firebase update fails, revert local change
      console.error("Failed to update Firebase:", error);
      set({ carts: get().carts });
    }
  },

  removeMeal: async (mealId) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Update locally first
    const updatedCarts = get().carts.filter((o) => o.mealId !== mealId);
    set({ carts: updatedCarts });

    // Then update Firebase
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { carts: updatedCarts }, { merge: true });
    } catch (error) {
      // If Firebase update fails, revert local change
      console.error("Failed to update Firebase:", error);
      set({ carts: get().carts });
    }
  },

  fetchCart: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const carts = userDoc.data()?.carts || [];
      set({ carts });
    }
  },

  clearCart: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Update locally first
    set({ carts: [] });

    // Then update Firebase
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { carts: [] }, { merge: true });
    } catch (error) {
      // If Firebase update fails, revert local change
      console.error("Failed to update Firebase:", error);
      set({ carts: get().carts });
    }
  },

  clearCartForRestaurant: (restaurantId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Update locally first
    set((state) => ({
      carts: state.carts.filter((item) => {
        return item.restaurantId !== restaurantId;
      }),
    }));

    // Then update Firebase
    try {
      const userRef = doc(db, "users", user.uid);
      const updatedCarts = get().carts.filter((item) => {
        return item.restaurantId !== restaurantId;
      });
      setDoc(userRef, { carts: updatedCarts }, { merge: true });
    } catch (error) {
      // If Firebase update fails, revert local change
      console.error("Failed to update Firebase:", error);
      set({ carts: get().carts });
    }
  },

  updateCartItemPrice: async (mealId: string, newPrice: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const updatedCarts = get().carts.map((cart) =>
      cart.mealId === mealId ? { ...cart, price: newPrice } : cart
    );
    set({ carts: updatedCarts });

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { carts: updatedCarts }, { merge: true });
    } catch (error) {
      console.error("Failed to update Firebase:", error);
      set({ carts: get().carts });
    }
  },

  getCartsByRestaurant: () => {
    const carts = get().carts;
    return carts.reduce((acc, cart) => {
      if (!acc[cart.restaurantId]) {
        acc[cart.restaurantId] = [];
      }
      acc[cart.restaurantId].push(cart);
      return acc;
    }, {} as { [restaurantId: string]: Cart[] });
  },
}));

export default useCartStore;
