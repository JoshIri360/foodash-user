import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "overview",
            headerShown: false,
            drawerLabelStyle: { color: "#005C2D" },
            drawerActiveTintColor: "#6CDE40",
          }}
        />
        <Drawer.Screen
          name="orderHistory"
          options={{
            drawerLabel: "Order History",
            title: "Order History",
            drawerLabelStyle: { color: "#005C2D" },
            drawerActiveTintColor: "#6CDE40",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerLabelStyle: { color: "#005C2D" },
            drawerActiveTintColor: "#6CDE40",
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
