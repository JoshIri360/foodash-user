import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type CartItem = {
  price: number;
  quantity: number;
  restaurantId: string;
};

type OrderBreakdown = {
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  totalAmount: number;
};

const getUniversityId = async (user: any) => {
  if (!user) return null;
  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();
  return userData?.selectedUniversity;
};

const getUniversityData = async (user: any) => {
  const universityId = await getUniversityId(user);
  if (!universityId) return null;
  const universityRef = doc(db, "universities", universityId);
  const universityDoc = await getDoc(universityRef);
  return universityDoc.data();
};

export const getTotalAmount = async (
  carts: CartItem[],
  restaurantId: string,
  universityData: any,
  deliveryFee: number
): Promise<number> => {
  try {
    if (!universityData) {
      console.log("University data not found");
      return 0;
    }

    let { serviceCharge } = universityData;

    // Convert values to numbers
    serviceCharge = Number(serviceCharge);
    deliveryFee = Number(deliveryFee);

    const filteredCarts = carts.filter(
      (cart) => cart.restaurantId === restaurantId
    );

    const subtotal = filteredCarts.reduce(
      (acc, o) => acc + Number(o.price) * Number(o.quantity),
      0
    );

    return subtotal + deliveryFee + serviceCharge;
  } catch (error) {
    console.error("Error calculating total amount:", error);
    return 0;
  }
};

export const getOrderBreakdown = async (
  carts: CartItem[],
  restaurantId: string,
  universityData: any,
  deliveryFee: number
): Promise<OrderBreakdown | null> => {

  console.log("Delivery Fee", deliveryFee);
  if (!universityData) return null;

  let { serviceCharge } = universityData;

  serviceCharge = Number(serviceCharge);
  deliveryFee = Number(deliveryFee);

  const filteredCarts = carts.filter(
    (cart) => cart.restaurantId === restaurantId
  );

  const subtotal = filteredCarts.reduce(
    (acc, o) => acc + Number(o.price) * Number(o.quantity),
    0
  );

  const totalAmount = subtotal + deliveryFee + serviceCharge;

  return {
    subtotal,
    deliveryFee,
    serviceCharge,
    totalAmount,
  };
};

export const getLocations = async (user: any) => {
  const universityData = await getUniversityData(user);
  if (!universityData) return null;
  return universityData.locations;
};
