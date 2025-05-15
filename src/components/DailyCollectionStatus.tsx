import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CollectionStatus = {
  date: string;
  totalOrdersDelivered: number;
  totalAmountCollected: number;
  paymentStatus: string;
};

const DailyCollectionStatus = () => {
  const [data, setData] = useState<CollectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCollectionStatus = async () => {
    try {
      setLoading(true);
       const token = await AsyncStorage.getItem('token');
      const response = await axios.get("https://grokart-2.onrender.com/api/v1/delivery/daily-collection", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch collection status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionStatus();
  }, []);

  const handleMarkAsPaid = () => {
    Alert.alert("Mark as Paid", "Trigger mark as paid logic here");
    // Optionally call a POST endpoint to update payment status
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading collection status...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>No data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Daily Collection Summary</Text>
      <Text style={styles.label}><Text style={styles.bold}>Date:</Text> {data.date}</Text>
      <Text style={styles.label}><Text style={styles.bold}>Total Orders Delivered:</Text> {data.totalOrdersDelivered}</Text>
      <Text style={styles.label}><Text style={styles.bold}>Total Amount Collected:</Text> ₹{data.totalAmountCollected}</Text>
      <Text style={styles.label}>
        <Text style={styles.bold}>Payment Status:</Text>{" "}
        <Text style={data.paymentStatus === "Payment Done Successfully" ? styles.statusDone : styles.statusPending}>
          {data.paymentStatus}
        </Text>
      </Text>

      {data.paymentStatus === "Payment Pending" && (
        <TouchableOpacity style={styles.button} onPress={handleMarkAsPaid}>
          <Text style={styles.buttonText}>Mark as Paid</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  statusDone: {
    color: "green",
    fontWeight: "bold",
  },
  statusPending: {
    color: "red",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default DailyCollectionStatus;
