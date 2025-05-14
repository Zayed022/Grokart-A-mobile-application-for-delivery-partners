import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const AssignedOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://grokart-2.onrender.com/api/v1/delivery/assigned-orders', {
        withCredentials: true, // for sending cookies
      });

      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  type Order = {
  _id: string;
  status: string;
  createdAt: string;
  userId: {
    name: string;
    address: string;
  };
  assignedTo?: {
    name: string;
    phoneNumber: string;
  };
};


  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.header}>Order ID: {item._id}</Text>
      <Text>User: {item.userId?.name}</Text>
      <Text>Address: {item.userId?.address}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Ordered At: {new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default AssignedOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  header: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
});
