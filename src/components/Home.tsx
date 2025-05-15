import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Grokart from "../assets/images/Grokart.png";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "./LogoutButton";
import LogoutTimer from "./LogoutTimer";

const WORK_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
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

const Home: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);
  const [statusToUpdate, setStatusToUpdate] = useState<string>("");
  const navigation = useNavigation();

  const validStatuses = ["Picked Up", "Out for Delivery", "Delivered"];

  const fetchAssignedOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/delivery/assigned-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter out orders that are delivered
      const activeOrders = response.data.data.filter(
        (order: Order) => order.status !== "Delivered"
      );

      setOrders(activeOrders);
    } catch (error: any) {
      if (error.response) {
        console.error("Response Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem("deliveryToken");

      const response = await axios.put(
        `https://grokart-2.onrender.com/api/v1/delivery/order/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("✅ Order status updated successfully!");
      setShowStatusOptions(false);
      fetchAssignedOrders(); // refresh the orders list

      if (status === "Delivered") {
        // Remove the delivered order from the list after 5 minutes
        setTimeout(() => {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== orderId)
          );
        }, 300000); // 5 minutes = 300000 ms
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Update Error:", error.response.data.message);
        Alert.alert(`❌ ${error.response.data.message}`);
      } else {
        console.error("Request Error:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image source={Grokart} style={{ width: 100, height: 30 }} />
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchAssignedOrders}
        >
          <Text style={styles.refreshButtonText}> Refresh</Text>
        </TouchableOpacity>
        

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("My Profile")}
        >
          <Text style={styles.profileButtonText}>My Profile</Text>
        </TouchableOpacity>
      </View>

      <View><LogoutTimer /></View>

      {/* Orders List */}
      <ScrollView contentContainerStyle={styles.ordersContainer}>
        <Text style={styles.heading}>Assigned Orders</Text>

        {orders.length === 0 ? (
          <Text>No orders assigned to you.</Text>
        ) : (
          orders.map((order) => (
            <View key={order._id} style={styles.orderCard}>
              <Text style={styles.sectionTitle}>
                Customer: {order.customerId.name}
              </Text>

              {/* Items List */}
              <Text style={styles.sectionSubtitle}>Items:</Text>
              {order.items.map((item) => (
                <View key={item._id} style={styles.itemBlock}>
                  <Text>🛒 Name: {item.name}</Text>
                  <Text>📦 Quantity: {item.quantity}</Text>
                  <Text>💰 Price: ₹{item.price}</Text>
                </View>
              ))}

              {/* Address */}
              <Text style={styles.sectionSubtitle}>📍 Address:</Text>
              <Text>{order.address}</Text>
              <Text>House Number: {order.addressDetails.houseNumber}</Text>
              <Text>Floor Number: {order.addressDetails.floor}</Text>
              <Text>Building Name: {order.addressDetails.building}</Text>
              <Text>Landmark: {order.addressDetails.landmark}, </Text>
              <Text>
                City: {order.addressDetails.city},{order.addressDetails.state} -
                {order.addressDetails.pincode}
              </Text>
              <Text>📞 Recipient Phone: {order.addressDetails.recipientPhoneNumber}</Text>

              {/* Status */}
              <Text>Status: {order.status}</Text>
              <Text>Order ID: {order._id}</Text>
              <Text>Total: ₹{order.totalAmount}</Text>
              <Text style={styles.timestamp}>
                {new Date(order.createdAt).toLocaleString()}
              </Text>

              {/* Update Status Button */}
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  order.status === "Delivered" && styles.completedButton,
                ]}
                onPress={() => {
                  if (order.status !== "Delivered") {
                    setSelectedOrderId(order._id);
                    setShowStatusOptions((prev) => !prev);
                  }
                }}
                disabled={order.status === "Delivered"}
              >
                <Text style={styles.statusButtonText}>
                  {order.status === "Delivered"
                    ? "Order Completed"
                    : "Update Order Status"}
                </Text>
              </TouchableOpacity>

              {/* Earning Text */}
              {order.status === "Delivered" && (
                <Text style={styles.earningText}>💸 Your Earning: ₹15</Text>
              )}

              {/* Status Options */}
              {showStatusOptions && selectedOrderId === order._id && (
                <View style={styles.statusOptions}>
                  {validStatuses.map((statusOption) => (
                    <TouchableOpacity
                      key={statusOption}
                      style={styles.statusOption}
                      onPress={() => updateOrderStatus(order._id, statusOption)}
                    >
                      <Text style={styles.statusOptionText}>{statusOption}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    elevation: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  profileButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  ordersContainer: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    color: '#111827',
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontWeight: "600",
    marginTop: 10,
  },
  itemBlock: {
    paddingLeft: 8,
    marginBottom: 6,
  },
  statusButton: {
    backgroundColor: "#4F46E5",
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  statusButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statusOptions: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  statusOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
    marginBottom: 8,
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "#22c55e", // Tailwind's green-500
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  statusOptionText: {
    fontWeight: "600",
    color: "#374151",
  },
  earningText: {
    marginTop: 6,
    color: "#16A34A", // green shade
    fontWeight: "bold",
    fontSize: 14,
  },
});
