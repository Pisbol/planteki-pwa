import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function SignupScreen() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !username || !password || !repeatPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optionally set displayName
      await updateProfile(user, { displayName: username });

      setUser({ email: user.email || "", username });
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Repeat Password"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={[styles.button, styles.backButton]}>
        <Text style={styles.buttonText}>Go Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#378837" },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  input: { width: 250, height: 40, backgroundColor: "white", marginBottom: 15, borderRadius: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "#ccc" },
  button: { width: 250, height: 45, backgroundColor: "#266e26", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  backButton: { backgroundColor: "#266e26" },
  buttonText: { color: "white", fontWeight: "bold" },
});
