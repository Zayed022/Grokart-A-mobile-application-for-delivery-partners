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
        const res = await axios.get('https://grokart-2.onrender.com/api/v1/delivery/completed-orders', {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with actual token logic
          },
        });

        setOrders(res.data.orders);
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
      <Text style={styles.label}>Order ID:</Text>
      <Text style={styles.value}>{item._id}</Text>

      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.value}>₹{item.totalAmount - 20}</Text>

      <Text style={styles.label}>Payment:</Text>
      <Text style={styles.value}>{item.paymentMethod} - {item.paymentStatus}</Text>

      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>{item.address}</Text>

      <Text style={styles.label}>Delivered At:</Text>
      <Text style={styles.value}>{moment(item.deliveredAt).format('DD MMM YYYY, hh:mm A')}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <>
    <Navbar/>
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrders}>No delivered orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  value: {
    marginBottom: 6,
  },
});

export default MyOrders;
