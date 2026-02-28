// app/_layout.tsx
import { View, KeyboardAvoidingView, Platform, Dimensions, Text } from "react-native";
import { Slot } from "expo-router";

export default function DriverAuthLayout() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : "padding"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          height: Dimensions.get("screen").height / 6,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Driver App</Text>
      </View>

      {/* Page content */}
      <Slot />
    </KeyboardAvoidingView>
  );
}
