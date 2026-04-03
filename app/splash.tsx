import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();

useEffect(() => {
  const timer = setTimeout(() => {
    router.replace("/"); 
  }, 2000);
  return () => clearTimeout(timer);
}, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Planteki</Text>
      <Text style={styles.sub}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#4d6e4d" },
  text: { color: 'white', fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  sub: { fontSize: 16, color: "gray" },
});
