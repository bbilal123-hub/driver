import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { account, databases } from "@/services/appwrite";

const DATABASE_ID = "686e37c60002650b53f2";
const ORDERS_COLLECTION_ID = "orders";

const STATUS_COLORS: Record<string, string> = {
  Pending: "#FFC107",
  "On Delivery": "#2196F3",
  Delivered: "#4CAF50",
  Canceled: "#F44336",
};

export default function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<any>(null);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<"available" | "assigned">("available");

  useEffect(() => {
    const init = async () => {
      try {
        const user = await account.get();
        setDriver(user);

        const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID);

        const assigned = res.documents.filter((o: any) => o.driverId === user.$id);
        const unassigned = res.documents.filter((o: any) => !o.driverId || o.driverId === "");

        setMyOrders(assigned);
        setAvailableOrders(unassigned);
      } catch (err) {
        console.log(err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const acceptAndOpenOrder = async (order: any) => {
    try {
      if (!driver) return;
      // Accept the order
      await databases.updateDocument(DATABASE_ID, ORDERS_COLLECTION_ID, order.$id, { driverId: driver.$id, status: "On Delivery" });
      
      // Update local state
      setAvailableOrders(prev => prev.filter(o => o.$id !== order.$id));
      setMyOrders(prev => [...prev, { ...order, driverId: driver.$id, status: "On Delivery" }]);

      // Navigate to order detail screen
      router.push(`/order/${order.$id}`);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to accept order");
    }
  };

  const openOrderDetails = (order: any) => {
    router.push(`/order/${order.$id}`);
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" /></View>
  );

  if (!driver) return null;

  const renderOrderCard = (order: any, isAvailable: boolean) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => isAvailable ? acceptAndOpenOrder(order) : openOrderDetails(order)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Order #{order.$id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] || "#777" }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      <Text><Text style={styles.bold}>Pickup:</Text> {order.pickupLocation}</Text>
      <Text><Text style={styles.bold}>Dropoff:</Text> {order.dropoffLocation}</Text>
      <Text><Text style={styles.bold}>Items:</Text> {order.items}</Text>
      <Text><Text style={styles.bold}>Total:</Text> ${order.totalPrice}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "available" && styles.activeTab]}
          onPress={() => setTab("available")}
        >
          <Text style={tab === "available" ? styles.activeTabText : styles.tabText}>Available Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "assigned" && styles.activeTab]}
          onPress={() => setTab("assigned")}
        >
          <Text style={tab === "assigned" ? styles.activeTabText : styles.tabText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === "available" ? availableOrders : myOrders}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No orders</Text>}
        renderItem={({ item }) => renderOrderCard(item, tab === "available")}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabContainer: { flexDirection: "row", marginHorizontal: 16, marginBottom: 10 },
  tabButton: { flex: 1, padding: 10, borderBottomWidth: 2, borderBottomColor: "transparent", alignItems: "center" },
  activeTab: { borderBottomColor: "#2196F3" },
  tabText: { fontSize: 16, color: "#777" },
  activeTabText: { color: "#2196F3", fontWeight: "700", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardTitle: { fontWeight: "700", fontSize: 16 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  bold: { fontWeight: "700" },
});
