import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "Planteki",
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerStyle: styles.headerStyle,

        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#cccccc",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="plant-wiki"
        options={{
          title: "Plant Wiki",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "leaf" : "leaf-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#378837",
  },
  tabBarStyle: {
    backgroundColor: "#378837",
    borderTopWidth: 1,
    borderTopColor: "#ffffff",
    height: 60,
  },
});
