import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NoInternetAlert = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No Internet Connection</Text>
    <Text style={styles.subText}>
      Please check your connection and try again
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
  subText: {
    color: "white",
  },
});

export default NoInternetAlert;
