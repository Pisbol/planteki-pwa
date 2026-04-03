import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "./firebaseConfig";
import { UserContext } from "./UserContext";

export default function SigninScreen() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info in context
      setUser({ username: user.displayName || "", email: user.email || "" });

      // Navigate to dashboard
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable onPress={() => router.push("/forgotPass")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </Pressable>

      <Pressable onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={[styles.button, styles.backButton]}>
        <Text style={styles.buttonText}>Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#378837" },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  input: { width: 250, height: 45, backgroundColor: "white", borderRadius: 8, borderWidth: 1, borderColor: "#ffffff", paddingHorizontal: 10, marginBottom: 15 },
  button: { width: 250, height: 45, backgroundColor: "#266e26", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  backButton: { backgroundColor: "#266e26" },
  buttonText: { color: "white", fontWeight: "bold" },
  link: { color: "#fff", marginBottom: 4, textDecorationLine: "underline" },
});
