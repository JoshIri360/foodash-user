import { useAuthStore } from "@/context/authStore";
import { db } from "@/firebaseConfig";
import { Link } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuthStore((state) => state);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      }
    };
    fetchOrders();
  }, [user]);

  const renderOrderItem = ({ item }: { item: any }) => (
    <Link
      href={{
        pathname: "/(app)/(home)/orderHistory/orderDetails",
        params: { orderId: item.id },
      }}
      asChild
    >
      <TouchableOpacity style={styles.orderItem}>
        <View>
          <Text style={styles.orderIdText}>Order ID: {item.id}</Text>
          <Text style={styles.orderStatusText}>Status: {item.status}</Text>
          <Text style={styles.orderItemsText}>
            Total Items: {item.items.length}
          </Text>
          <Text style={styles.orderCreatedAtText}>
            Created At: {item.createdAt.toDate().toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1e1e1e",
  },
  headerText: {
    color: "#05B817",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  orderItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#2d2d2d",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  orderIdText: {
    color: "#05B817",
    fontSize: 18,
    marginBottom: 4,
  },
  orderStatusText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 4,
  },
  orderItemsText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 4,
  },
  orderCreatedAtText: {
    color: "#ffffff",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default OrderHistory;
