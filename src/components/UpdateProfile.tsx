import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './Navbar';

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch current details to pre-fill fields
    const fetchDetails = async () => {
      try {
        const res = await axios.get('http://<YOUR_BACKEND_URL>/api/delivery/get-my-details', {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`,
          },
        });

        const data = res.data.data;
        setName(data.name);
        setPhone(data.phone);
        setVehicleNumber(data.vehicleNumber);
        setLicenseNumber(data.licenseNumber);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchDetails();
  }, []);

  const handleUpdate = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
      const res = await axios.put(
        'https://grokart-2.onrender.com/api/v1/delivery/update',
        {
          name,
          phone,
          vehicleNumber,
          licenseNumber,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', res.data.message);
    } catch (err: any) {
      console.error('Update failed:', err);
      Alert.alert('Error', err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
    <Navbar/>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Vehicle Number</Text>
      <TextInput style={styles.input} value={vehicleNumber} onChangeText={setVehicleNumber} />

      <Text style={styles.label}>License Number</Text>
      <TextInput style={styles.input} value={licenseNumber} onChangeText={setLicenseNumber} />

      <Text style={styles.label}>Password (optional)</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Button title="Update Profile" onPress={handleUpdate} />
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
});

export default UpdateProfile;
