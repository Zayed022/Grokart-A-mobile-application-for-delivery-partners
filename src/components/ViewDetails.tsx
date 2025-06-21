import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
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
        <ActivityIndicator size="large" color="#6366F1" />
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
      <Navbar />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Delivery Partner Profile</Text>

        <View style={styles.card}>
          <SectionTitle title="Basic Details" />
          <Detail label="Name" value={details.name} />
          <Detail label="Phone" value={details.phone} />
          <Detail label="Email" value={details.email} />
          <Detail label="Vehicle Number" value={details.vehicleNumber} />
          <Detail label="License Number" value={details.licenseNumber} />
          <Detail label="Approved" value={details.isApproved ? 'Yes' : 'No'} />
          <Detail label="Available" value={details.isAvailable ? 'Yes' : 'No'} />
          <Detail label="Account Created" value={new Date(details.createdAt).toLocaleString()} />
        </View>

        <View style={styles.card}>
          <SectionTitle title="Uploaded Documents" />
          <ImageSection label="Aadhaar Card" uri={details.aadhaarProof} />
          <ImageSection label="PAN Card" uri={details.panCardProof} />
          <ImageSection label="PUC Document" uri={details.pucProof} />
          <ImageSection label="License Image" uri={details.licenseProof} />
        </View>
      </ScrollView>
    </>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const ImageSection = ({ label, uri }: { label: string; uri: string }) => (
  <View style={styles.imageSection}>
    <Text style={styles.label}>{label}</Text>
    <Image source={{ uri }} style={styles.image} />
  </View>
);

export default ViewDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  detailRow: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  imageSection: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    resizeMode: 'cover',
    marginTop: 6,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
});
