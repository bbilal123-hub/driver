// components/OrderMap.tsx
import React from "react";
import MapView, { Marker } from "react-native-maps";

export default function OrderMap({ pickup, dropoff }: any) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: pickup.lat,
        longitude: pickup.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} title="Pickup" />
      <Marker coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }} title="Dropoff" />
    </MapView>
  );
}
