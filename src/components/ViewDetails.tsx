import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './Navbar';

interface DeliveryPartnerDetails {
  _id: string;
  name: string;
  phone: string;
  email: string;
  aadhaarProof: string;
  panCardProof: string;
  vehicleNumber: string;
  pucProof: string;
  licenseNumber: string;
  licenseProof: string;
  isApproved: boolean;
  isAvailable: boolean;
  createdAt: string;
}

const ViewDetails = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<DeliveryPartnerDetails | null>(null);

  const fetchDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('https://grokart-2.onrender.com/api/v1/delivery/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Could not load details.</Text>
      </View>
    );
  }

  return (
    <>
    <Navbar/>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My Profile Details</Text>

      <View style={styles.card}>
        <Detail label="Name" value={details.name} />
        <Detail label="Phone" value={details.phone} />
        <Detail label="Email" value={details.email} />
        <Detail label="Vehicle Number" value={details.vehicleNumber} />
        <Detail label="License Number" value={details.licenseNumber} />
        <Detail label="Approved" value={details.isApproved ? 'Yes' : 'No'} />
        <Detail label="Available" value={details.isAvailable ? 'Yes' : 'No'} />
        <Detail label="Account Created At" value={new Date(details.createdAt).toLocaleString()} />
      </View>

      <Text style={styles.subHeading}>Uploaded Documents</Text>

      <View style={styles.card}>
        <ImageSection label="Aadhaar Proof" uri={details.aadhaarProof} />
        <ImageSection label="PAN Card Proof" uri={details.panCardProof} />
        <ImageSection label="PUC Proof" uri={details.pucProof} />
        <ImageSection label="License Proof" uri={details.licenseProof} />
      </View>
    </ScrollView>
    </>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const ImageSection = ({ label, uri }: { label: string; uri: string }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <Image source={{ uri }} style={styles.image} />
  </View>
);

export default ViewDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  detailRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    resizeMode: 'cover',
    marginTop: 8,
  },
});
