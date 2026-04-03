import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";  

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      headerTitle: "Planteki",
      headerTitleAlign: "center",
      headerTintColor: "#ffffff",
      headerStyle: styles.headerStyle,

      tabBarStyle: styles.tabBarStyle,
      tabBarActiveTintColor: "#ffffff",
      tabBarInactiveTintColor: "#6e6e6e",
      }}>
      <Tabs.Screen name="dashboard" options={{ title: "dashboard" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
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