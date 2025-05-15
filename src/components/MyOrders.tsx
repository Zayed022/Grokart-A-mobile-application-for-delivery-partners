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

    <Text style={styles.label}>Delivery Address:</Text>
    <Text style={styles.value}>{item.address}</Text>

    {item.addressDetails && (
      <>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{item.addressDetails.houseNumber || "N/A"}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{item.addressDetails.floor || "N/A"}</Text>

         <Text style={styles.label}>Building: </Text>
        <Text style={styles.value}>{item.addressDetails.building || "N/A"}</Text>

        <Text style={styles.label}>Landmark:</Text>
        <Text style={styles.value}>{item.addressDetails.landmark || "N/A"}</Text>

        <Text style={styles.label}>City:</Text>
        <Text style={styles.value}>{item.addressDetails.city || "N/A"}</Text>

        <Text style={styles.label}>State:</Text>
        <Text style={styles.value}>{item.addressDetails.state || "N/A"}</Text>

        <Text style={styles.label}>Pincode:</Text>
        <Text style={styles.value}>{item.addressDetails.pincode || "N/A"}</Text>

        <Text style={styles.label}>Recepient Phone Number:</Text>
        <Text style={styles.value}>{item.addressDetails.recipientPhoneNumber || "N/A"}</Text>
      </>
    )}

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
      <Text style={styles.comporder}>Completed Orders till now: {orders.length}</Text>
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
    color: '#111827'
  },
  comporder:{
     textAlign: 'center',
     color:"#28a745",
     fontWeight: 'bold',
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#111827'
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#111827',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 4,
    color: '#111827',
  },
  value: {
    marginBottom: 6,
  },
});

export default MyOrders;
