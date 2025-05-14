import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, View, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'https://grokart-2.onrender.com/api/v1/delivery/logout',
        {},
        { withCredentials: true }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Logged out successfully");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        Alert.alert("Logout failed", response.data.message || "Please try again");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "An error occurred during logout");
    }
  };
  const handleCancel = () => {
    navigation.goBack(); // or navigate to Home
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/463/463612.png' }} // logout icon
        style={styles.icon}
      />
      <Text style={styles.heading}>Are you sure?</Text>
      <Text style={styles.subtext}>You are about to log out from your account.</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});

