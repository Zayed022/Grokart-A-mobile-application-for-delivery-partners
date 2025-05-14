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
        setTotalDeliveries(totalDeliveries);
        setTotalEarnings(totalEarnings);
        setDailyHistory(dailyHistory);
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
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Deliveries:</Text>
        <Text style={styles.cardValue}>{item.numberOfDeliveries}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Base Earnings:</Text>
        <Text style={styles.cardValue}>₹{item.dailyEarnings}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Incentive:</Text>
        <Text style={styles.cardValue}>₹{item.incentive}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { fontWeight: 'bold' }]}>Total for Day:</Text>
        <Text style={[styles.cardValue, styles.green]}>₹{item.totalEarningsForDay}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
    <Navbar/>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Earnings</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Total Deliveries</Text>
          <Text style={styles.summaryValue}>{totalDeliveries}</Text>

          <Text style={[styles.summaryText, { marginTop: 12 }]}>Total Earnings</Text>
          <Text style={[styles.summaryValue, styles.green]}>₹{totalEarnings}</Text>
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
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  green: {
    color: '#28a745',
  },
  sectionTitle: {
    fontSize: 20,
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
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 15,
    color: '#666',
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});
