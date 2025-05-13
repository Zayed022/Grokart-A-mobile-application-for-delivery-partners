import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, Delivery Partner 👋</Text>

      <View style={styles.buttonContainer}>
        <Button title="My Orders" onPress={() => navigation.navigate('Orders')} />
        <Button title="My Profile" onPress={() => navigation.navigate('Profile')} />
        <Button title="Logout" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 15,
  },
});
