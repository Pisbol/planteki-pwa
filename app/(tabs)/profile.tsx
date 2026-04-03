import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { UserContext } from "../UserContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    setUser(null); // clear user context
    router.replace("/"); // go back to index (sign-in entry point)
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Avatar placeholder */}
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />

        <Text style={styles.header}>My Profile</Text>

        {/* Email (read-only) */}
        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{user?.email ?? "Not set"}</Text>

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        {isEditing ? (
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        ) : (
          <Text style={styles.info}>{username}</Text>
        )}

        {/* Bio */}
        <Text style={styles.label}>Bio</Text>
        {isEditing ? (
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            multiline
            style={[styles.input, styles.bioInput]}
          />
        ) : (
          <Text style={styles.info}>{bio || "No bio yet"}</Text>
        )}

        {/* Buttons */}
        {isEditing ? (
          <Pressable
            onPress={() => {
              setUser({ ...user, username, bio });
              setIsEditing(false);
              alert("Profile updated!");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setIsEditing(true)}
            style={[styles.button, { backgroundColor: "#266e26" }]}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Pressable>
        )}

        {/* Logout button */}
        <Pressable onPress={handleLogout} style={[styles.button, { backgroundColor: "#b22222" }]}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f5f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#266e26",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#266e26",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
