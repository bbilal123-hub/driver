// app/order/[id].tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, Alert, Linking, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { databases } from "@/services/appwrite";

const DB = "686e37c60002650b53f2";
const ORDERS = "orders";

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await databases.getDocument(DB, ORDERS, id as string);
        setOrder({
          ...res,
          pickupLat: Number(res.pickupLat),
          pickupLng: Number(res.pickupLng),
          dropoffLat: Number(res.dropoffLat),
          dropoffLng: Number(res.dropoffLng),
        });
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to load order");
      }
    };
    loadOrder();
  }, [id]);

  const openNavigation = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Cannot open maps"));
  };

  if (!order) return <Text>Loading order...</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 300 }}>
        <MapView
          ref={(r) => {
            mapRef.current = r;
          }}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: order.pickupLat,
            longitude: order.pickupLng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker
            coordinate={{ latitude: order.pickupLat, longitude: order.pickupLng }}
            title="Pickup"
            description={order.pickupLocation}
          />
          <Marker
            coordinate={{ latitude: order.dropoffLat, longitude: order.dropoffLng }}
            title="Dropoff"
            description={order.dropoffLocation}
          />
        </MapView>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: "700", fontSize: 18 }}>Order #{order.$id}</Text>
        <Text>Pickup: {order.pickupLocation}</Text>
        <Text>Dropoff: {order.dropoffLocation}</Text>
        <Text>Items: {order.items}</Text>
        <Text>Total: ${order.totalPrice}</Text>

        <Button title="Navigate to Pickup" onPress={() => openNavigation(order.pickupLat, order.pickupLng)} />
        <Button title="Navigate to Dropoff" onPress={() => openNavigation(order.dropoffLat, order.dropoffLng)} />
        <Button title="Call Customer" onPress={() => Linking.openURL(`tel:${order.customerPhone || ""}`)} />
      </View>
    </View>
  );
}
