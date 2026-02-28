// app/sign-up.tsx
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { router, Link } from "expo-router";
import { account, ID } from "@/services/appwrite";

export default function DriverSignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      return Alert.alert("Error", "Fill all fields");
    }

    setLoading(true);
    try {
      await account.create(ID.unique(), form.email, form.password, form.name);
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
      <Text>Full Name</Text>
      <TextInput
        placeholder="Enter full name"
        value={form.name}
        onChangeText={(t) => setForm((prev) => ({ ...prev, name: t }))}
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Text>Email</Text>
      <TextInput
        placeholder="Enter email"
        value={form.email}
        onChangeText={(t) => setForm((prev) => ({ ...prev, email: t }))}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Text>Password</Text>
      <TextInput
        placeholder="Enter password"
        value={form.password}
        onChangeText={(t) => setForm((prev) => ({ ...prev, password: t }))}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Button title={loading ? "Signing Up..." : "Sign Up"} onPress={submit} />

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Text>Already a driver?</Text>
        <Link href="/login"> Sign In</Link>
      </View>
    </View>
  );
}
