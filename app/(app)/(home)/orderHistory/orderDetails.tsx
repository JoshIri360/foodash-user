import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const OrderDetails = () => {
  const [order, setOrder] = useState<DocumentData | null>(null);
  const params = useLocalSearchParams();
  const { orderId } = params;

  const fetchOrder = async () => {
    if (typeof orderId !== "string") {
      console.error("Invalid orderId");
      return;
    }

    try {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);
      if (orderDoc.exists()) {
        setOrder(orderDoc.data());
      } else {
        console.error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order: ", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Order Details</Text>
      <Text style={styles.orderIdText}>Order ID: {orderId}</Text>
      <Text style={styles.orderStatusText}>Status: {order.status}</Text>
      <Text style={styles.orderLocationText}>Location: {order.location}</Text>
      <FlatList
        data={order.items}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemNameText}>Meal: {item.name}</Text>
            <Text style={styles.itemQuantityText}>
              Quantity: {item.quantity}
            </Text>
            <Text style={styles.itemPriceText}>Price: {item.price}</Text>
            <FlatList
              data={item.images}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.image} />
              )}
              keyExtractor={(image, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        keyExtractor={(item) => item.mealId}
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
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  headerText: {
    color: "#05B817",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    // textAlign: "center",
  },
  orderIdText: {
    color: "#05B817",
    fontSize: 18,
    marginBottom: 10,
    // textAlign: "center",
  },
  orderStatusText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 5,
    // textAlign: "center",
  },
  orderLocationText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 20,
    // textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#2d2d2d",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  itemNameText: {
    color: "#05B817",
    fontSize: 18,
    marginBottom: 4,
  },
  itemQuantityText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 4,
  },
  itemPriceText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 4,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default OrderDetails;
