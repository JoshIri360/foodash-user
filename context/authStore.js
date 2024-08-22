import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/components/notifications";

const useAuthStore = create((set, get) => ({
  user: null,
  userData: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,
  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const pushToken = await registerForPushNotificationsAsync(user.uid);
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { pushToken: pushToken || "" }, { merge: true });
      set({ user, isAuthenticated: true, isGuest: false, isLoading: false });
      await get().fetchUserData(user.uid);
      return { success: true, data: user };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, data: error.message };
    }
  },
  loginAsGuest: async () => {
    set({
      user: { uid: "guest" },
      isAuthenticated: true,
      isGuest: true,
    });
  },
  register: async ({
    username,
    phoneNumber,
    email,
    password,
    selectedUniversity,
  }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!user.uid) {
        throw new Error("User UID is undefined after creation");
      }

      const pushTokenString = await registerForPushNotificationsAsync(user.uid);

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        username,
        phoneNumber,
        email,
        selectedUniversity,
        balance: 0,
        pushToken: pushTokenString || "",
      });

      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        throw new Error("User document was not created successfully");
      }

      const userWithUid = { ...user, uid: user.uid };
      set({ user: userWithUid, isAuthenticated: true, isGuest: false });
      await get().fetchUserData(user.uid);
      return { success: true, data: user };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, data: error.message };
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({
        user: null,
        isAuthenticated: false,
        userData: null,
        isGuest: false,
      });
      return { success: true };
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
  fetchUserData: async (uid) => {
    try {
      if (!uid) {
        console.warn("No user ID provided.");
        return;
      }
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        set({ userData: userDocSnapshot.data() });
      } else {
        console.warn("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },
}));

const authStateSubscriber = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      useAuthStore.setState({ user, isAuthenticated: !!user, isGuest: false });
      if (user) {
        useAuthStore.getState().fetchUserData(user.uid);
      }
    });

    return unsubscribe;
  }, []);
};

export { useAuthStore, authStateSubscriber };
