import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  RefreshControl,
  Linking,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Grokart from "../assets/images/Grokart.png";
import { useNavigation } from "@react-navigation/native";
import LogoutTimer from "./LogoutTimer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  description: string;
}

interface AddressDetails {
  houseNumber: string;
  floor: string;
  building: string;
  landmark: string;
  recipientPhoneNumber: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  customerId: {
    _id: string;
    name: string;
  };
  items: Item[];
  address: string;
  addressDetails: AddressDetails;
  createdAt: string;
  totalAmount: number;
  status: string;
}

const STATUS_COLORS: { [key: string]: string } = {
  Assigned: "#EAB308",
  "Picked Up": "#3B82F6",
  "Out for Delivery": "#8B5CF6",
  Delivered: "#10B981",
};

const Home: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();

  const fetchAssignedOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/delivery/assigned-orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const activeOrders = response.data.data.filter(
        (order: Order) => order.status !== "Delivered"
      );
      setOrders(activeOrders);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || error?.message || "Failed to fetch orders.";
      console.error("Error:", errMsg);
      Alert.alert("❌ Error", errMsg);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem("deliveryToken");

      await axios.put(
        `https://grokart-2.onrender.com/api/v1/delivery/order/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("✅ Order status updated successfully!");
      setSelectedOrderId(null);
      fetchAssignedOrders();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || error?.message || "Status update failed.";
      console.error("Update Error:", errMsg);
      Alert.alert("❌ Error", errMsg);
    }
  };

  const getNextStatus = (current: string): string | null => {
    if (current === "Assigned") return "Picked Up";
    if (current === "Picked Up") return "Out for Delivery";
    if (current === "Out for Delivery") return "Delivered";
    return null;
  };

  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      Alert.alert("Error", "Could not open dialer")
    );
  };

  useEffect(() => {
    fetchAssignedOrders();
    const interval = setInterval(fetchAssignedOrders, 25000);
    return () => clearInterval(interval);
  }, []);

  const renderOrderCard = (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    const borderColor = STATUS_COLORS[order.status] || "#D1D5DB";

    return (
      <View key={order._id} style={[styles.orderCard, { borderColor }]}>
        <View style={styles.orderHeader}>
          <Text style={styles.customerName}>{order.customerId.name}</Text>
          <Text style={styles.timestamp}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>📦 Items</Text>
        {order.items.map((item) => (
          <Text key={item._id} style={styles.itemText}>
            • {item.name} ({item.description}) × {item.quantity}  = ₹{item.price}
            
            
          </Text>
           
        ))}

        <Text style={styles.sectionLabel}>📍 Address</Text>
        <Text style={styles.addressText}>{order.address}</Text>
        <Text style={styles.addressText}>
          {order.addressDetails.houseNumber}, Floor {order.addressDetails.floor},{" "}
          {order.addressDetails.building}
        </Text>
        <Text style={styles.addressText}>
          {order.addressDetails.landmark}, {order.addressDetails.city} -{" "}
          {order.addressDetails.pincode}
        </Text>

        <TouchableOpacity onPress={() => handlePhoneCall(order.addressDetails.recipientPhoneNumber)}>
          <Text style={styles.callText}>📞 {order.addressDetails.recipientPhoneNumber}</Text>
        </TouchableOpacity>

        <Text style={styles.statusInfo}>Status: {order.status}</Text>
        <Text style={styles.orderId}>Order ID: {order._id}</Text>
        <Text style={styles.totalPrice}>Total: ₹{order.totalAmount}</Text>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: nextStatus ? STATUS_COLORS[order.status] : "#9CA3AF" },
          ]}
          onPress={() => nextStatus && setSelectedOrderId(order._id)}
          disabled={!nextStatus}
        >
          <Text style={styles.buttonText}>
            {nextStatus ? "Update Status" : "Completed"}
          </Text>
        </TouchableOpacity>

        {selectedOrderId === order._id && nextStatus && (
          <TouchableOpacity
            style={styles.updateBox}
            onPress={() => updateOrderStatus(order._id, nextStatus)}
          >
            <Text style={styles.updateBoxText}>Mark as {nextStatus}</Text>
          </TouchableOpacity>
        )}

        {order.status === "Delivered" && (
          <Text style={styles.earning}>💸 Earning: ₹15</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={Grokart} style={styles.logoImage} />
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchAssignedOrders}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("My Profile")}
          >
            <Text style={styles.profileText}>My Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LogoutTimer />

      <ScrollView
        contentContainerStyle={styles.scrollArea}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAssignedOrders} />
        }
      >
        <Text style={styles.pageTitle}>📋 Your Assigned Deliveries</Text>
        {orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Icon name="truck-delivery-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyMessage}>No current orders assigned.</Text>
          </View>
        ) : (
          orders.map(renderOrderCard)
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    elevation: 3,
  },
  logoImage: { width: 100, height: 30, resizeMode: "contain" },
  navActions: { flexDirection: "row", gap: 8 },
  profileButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  profileText: { color: "#FFFFFF", fontWeight: "600" },
  refreshButton: {
    backgroundColor: "#10B981",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshText: { color: "#FFFFFF", fontWeight: "600" },
  scrollArea: { padding: 16, paddingBottom: 50 },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  emptyBox: { alignItems: "center", marginTop: 60 },
  emptyMessage: { fontSize: 16, color: "#6B7280", marginTop: 10 },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 2,
    padding: 14,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  customerName: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  timestamp: { fontSize: 12, color: "#9CA3AF" },
  sectionLabel: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    color: "#374151",
  },
  itemText: { fontSize: 14, color: "#1F2937", marginLeft: 8, marginTop: 2 },
  addressText: { fontSize: 13, color: "#374151", marginLeft: 4 },
  callText: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
    color: "#2563EB",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  statusInfo: { marginTop: 10, color: "#6B7280", fontSize: 13 },
  orderId: { fontSize: 12, color: "#9CA3AF" },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#111827",
    marginTop: 4,
  },
  actionButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "600" },
  updateBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },
  updateBoxText: { color: "#1F2937", fontWeight: "600" },
  earning: {
    marginTop: 8,
    color: "#16A34A",
    fontWeight: "600",
    fontSize: 14,
  },
});
