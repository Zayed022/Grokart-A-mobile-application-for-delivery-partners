import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const WORK_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

const LogoutTimer = () => {
  const navigation = useNavigation();
  const [canLogout, setCanLogout] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION_MS);

  useEffect(() => {
    const checkTime = async () => {
      const storedLoginTime = await AsyncStorage.getItem('loginTime');
      if (!storedLoginTime) {
        // No login time saved, allow logout (or handle accordingly)
        setCanLogout(true);
        return;
      }

      const loginTime = JSON.parse(storedLoginTime) as number;
      const elapsed = Date.now() - loginTime;

      if (elapsed >= WORK_DURATION_MS) {
        setCanLogout(true);
      } else {
        setTimeLeft(WORK_DURATION_MS - elapsed);
        setCanLogout(false);
      }
    };

    checkTime();

    const interval = setInterval(() => {
      checkTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!canLogout) {
    return (
      <View style={styles.container}>
        <Text style={styles.timerText}>
          You can Logout after {formatTime(timeLeft)}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => navigation.navigate('Logout')}
    >
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LogoutTimer;
