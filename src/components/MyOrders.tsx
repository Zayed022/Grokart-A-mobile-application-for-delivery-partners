import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './Navbar';

type Order = {
  _id: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  address: string;
  addressDetails: {
    houseNumber: string;
    floor: string;
    building: string;
    landmark: string;
    recipientPhoneNumber: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveredAt: string;
  status: string;
};

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
  const fetchCompletedOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        'https://grokart-2.onrender.com/api/v1/delivery/completed-orders',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Sort orders by deliveredAt descending (most recent first)
      const sortedOrders = res.data.orders.sort(
        (a: Order, b: Order) => new Date(b.deliveredAt).getTime() - new Date(a.deliveredAt).getTime()
      );

      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchCompletedOrders();
}, []);


  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text style={styles.cardTitle}>Order ID: <Text style={styles.cardValue}>{item._id}</Text></Text>
      <View style={styles.row}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₹{item.totalAmount - 20}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Payment:</Text>
        <Text style={styles.value}>{item.paymentMethod} - {item.paymentStatus}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.value}>{item.address}</Text>
        <Text style={styles.value}>House No: {item.addressDetails.houseNumber || "N/A"}</Text>
        <Text style={styles.value}>Floor: {item.addressDetails.floor || "N/A"}</Text>
        <Text style={styles.value}>Building: {item.addressDetails.building || "N/A"}</Text>
        <Text style={styles.value}>Landmark: {item.addressDetails.landmark || "N/A"}</Text>
        <Text style={styles.value}>City: {item.addressDetails.city || "N/A"}</Text>
        <Text style={styles.value}>State: {item.addressDetails.state || "N/A"}</Text>
        <Text style={styles.value}>Pincode: {item.addressDetails.pincode || "N/A"}</Text>
        <Text style={styles.value}>Phone: {item.addressDetails.recipientPhoneNumber || "N/A"}</Text>
      </View>
      <Text style={styles.deliveredAt}>
        Delivered At: {moment(item.deliveredAt).format('DD MMM YYYY, hh:mm A')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.compOrder}>Total Delivered Orders: {orders.length}</Text>
        <Text style={styles.header}>My Orders</Text>

        {orders.length === 0 ? (
          <Text style={styles.noOrders}>No delivered orders found.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderOrder}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginVertical: 12,
  },
  compOrder: {
    textAlign: 'center',
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 8,
  },
  noOrders: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  cardValue: {
    fontWeight: '400',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontWeight: '500',
    color: '#374151',
  },
  value: {
    color: '#1F2937',
  },
  section: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4,
  },
  deliveredAt: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'right',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
