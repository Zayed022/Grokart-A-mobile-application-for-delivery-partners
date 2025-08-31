import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import { Platform, Vibration, PermissionsAndroid } from 'react-native';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  // Configure Notifications
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("LOCAL NOTIFICATION:", notification);
    },
    requestPermissions: Platform.OS === 'ios',
  });

  // Create Channel
  PushNotification.createChannel(
    {
      channelId: "grokart-orders",
      channelName: "Grokart Order Alerts",
      channelDescription: "Alerts delivery partners for new orders",
      playSound: true,
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );

  // 🟢 TEST: fire a notification after 5s
 

}, []);



  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.warn('Error reading token:', error);
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => {
          SplashScreen.hide();
          setIsLoading(false);
        }, 2000); // splash delay
      }
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
