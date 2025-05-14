import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
console.log(SplashScreen)

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // (Optional) Add a real token validation with backend
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
        <AppNavigator/>
      </NavigationContainer>
   
  );
};

export default App;