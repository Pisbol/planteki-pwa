import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig"; // make sure this points to your config file

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset link sent to ${email}`);
      router.replace("/signup");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we’ll send you a reset link.
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Pressable onPress={handleReset} style={styles.button}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/signup")}
        style={[styles.button, styles.backButton]}
      >
        <Text style={styles.buttonText}>Back to Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#378837",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#eee",
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 300,
  },
  input: {
    width: 250,
    height: 45,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: 250,
    height: 45,
    backgroundColor: "#266e26",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: "#266e26",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
