// app/dashboard.tsx
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { account } from "@/services/appwrite";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        if (user) setUserExists(true);
      } catch {
        router.replace("/login"); // redirect if no session
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    await account.deleteSession("current");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userExists) return null;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Welcome, Driver 🚖</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
