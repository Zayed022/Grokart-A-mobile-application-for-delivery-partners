import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';

const MyProfile = () => {
  const navigation = useNavigation();

  return (
    <>
    <Navbar/>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('My Details')}
        activeOpacity={0.8}
      >
        <Text style={styles.menuText}>View My Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Update Details')}
        activeOpacity={0.8}
      >
        <Text style={styles.menuText}>Update My Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('My Completed Orders')}
        activeOpacity={0.8}
      >
        <Text style={styles.menuText}>Completed Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('My Earnings')}
        activeOpacity={0.8}
      >
        <Text style={styles.menuText}>View My Earnings</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
  },
});
