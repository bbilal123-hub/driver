// app/login.tsx
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { router, Link } from "expo-router";
import { account } from "@/services/appwrite";

export default function DriverLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) return Alert.alert("Error", "Enter valid credentials");

    setLoading(true);
    try {
      await account.createEmailPasswordSession(form.email, form.password);
      router.replace("/"); // redirect to dashboard
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Email</Text>
      <TextInput
        value={form.email}
        onChangeText={(t) => setForm((prev) => ({ ...prev, email: t }))}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Text>Password</Text>
      <TextInput
        value={form.password}
        onChangeText={(t) => setForm((prev) => ({ ...prev, password: t }))}
        placeholder="Enter password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Button title={loading ? "Signing In..." : "Sign In"} onPress={submit} />

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Text>Don’t have an account?</Text>
        <Link href="/sign-up"> Sign Up</Link>
      </View>
    </View>
  );
}
