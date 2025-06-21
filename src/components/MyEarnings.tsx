import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './Navbar';

const MyEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dailyHistory, setDailyHistory] = useState([]);

  useEffect(() => {
  const fetchEarnings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('https://grokart-2.onrender.com/api/v1/delivery/earnings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { totalDeliveries, totalEarnings, dailyHistory } = res.data;

      // Sort daily history by date descending
      const sortedHistory = [...dailyHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTotalDeliveries(totalDeliveries);
      setTotalEarnings(totalEarnings);
      setDailyHistory(sortedHistory);
    } catch (err) {
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchEarnings();
}, []);


  const renderDayItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardDate}>{item.date}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Deliveries</Text>
        <Text style={styles.value}>{item.numberOfDeliveries}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Base Earnings</Text>
        <Text style={styles.value}>₹{item.dailyEarnings}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Incentive</Text>
        <Text style={styles.value}>₹{item.incentive}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { fontWeight: 'bold' }]}>Total</Text>
        <Text style={[styles.value, styles.totalAmount]}>₹{item.totalEarningsForDay}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <>
      <Navbar />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f7' }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>My Earnings</Text>

          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Deliveries</Text>
              <Text style={styles.summaryValue}>{totalDeliveries}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
              <Text style={[styles.summaryValue, styles.totalEarnings]}>
                ₹{totalEarnings}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          <FlatList
            data={dailyHistory}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderDayItem}
            scrollEnabled={false}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default MyEarnings;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1e1e1e',
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  totalEarnings: {
    color: '#28a745',
  },
  divider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#444',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontSize: 15,
    color: '#666',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  totalAmount: {
    color: '#28a745',
  },
});
