import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface University {
  id: string;
  name: string;
  serviceCharge?: number;
  locations?: any;
}

interface UniversityStore {
  currentUniversity: University | null;
  setCurrentUniversity: (universityId: string) => Promise<void>;
  clearCurrentUniversity: () => void;
}

export const useUniversityStore = create<UniversityStore>((set) => ({
  currentUniversity: null,
  setCurrentUniversity: async (universityId: string) => {
    try {
      const docRef = doc(db, "universities", universityId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const universityData = docSnap.data() as University;
        set({ currentUniversity: { ...universityData, id: universityId } });
      } else {
        console.error("No such university!");
        set({ currentUniversity: null });
      }
    } catch (error) {
      console.error("Error fetching university details:", error);
      set({ currentUniversity: null });
    }
  },
  clearCurrentUniversity: () => set({ currentUniversity: null }),
}));
