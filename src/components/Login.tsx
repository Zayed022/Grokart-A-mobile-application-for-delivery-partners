// Login.tsx

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FormData {
  email: string;
  password: string;
}

interface Theme {
  container: any;
  title: any;
  input: any;
  button: any;
  buttonText: any;
  link: any;
  card: any;
}

const Login = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation<NavigationProp>();
  const [form, setForm] = useState<FormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const theme = useMemo<Theme>(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  const validateFields = useCallback(() => {
    if (!form.email || !form.password) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return false;
    }
    return true;
  }, [form]);

  const handleLogin = useCallback(async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        'https://grokart-2.onrender.com/api/v1/delivery/login',
        form,
        { withCredentials: true }
      );

      if (res.data?.deliveryPartner) {
         await AsyncStorage.setItem('loginTime', JSON.stringify(Date.now()));
        Alert.alert('Success', 'Login successful');
        setTimeout(() => navigation.navigate('Home'), 500);
      } else {
        Alert.alert('Error', 'Invalid credentials or response');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  }, [form, validateFields, navigation]);

  const handleInputChange = useCallback(
    (key: keyof FormData, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, theme.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, theme.card]}>
        <Text style={[styles.title, theme.title]}>Welcome Back 👋</Text>
        <Text style={[styles.subtitle, theme.title]}>Login to continue</Text>

        {['email', 'password'].map((field) => (
          <TextInput
            key={field}
            style={[styles.input, theme.input]}
            placeholder={field === 'email' ? 'Email' : 'Password'}
            placeholderTextColor={theme.input.color}
            secureTextEntry={field === 'password'}
            autoCapitalize="none"
            value={form[field as keyof FormData]}
            onChangeText={(val) => handleInputChange(field as keyof FormData, val)}
            keyboardType={field === 'email' ? 'email-address' : 'default'}
          />
        ))}

        <TouchableOpacity
          style={[styles.button, theme.button]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={theme.buttonText.color} />
          ) : (
            <Text style={[styles.buttonText, theme.buttonText]}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.link, theme.link]}>
              Don’t have an account? <Text style={styles.linkBold}>Register</Text>
            </Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  linksContainer: {
    alignItems: 'center',
    gap: 8,
  },
  link: {
    fontSize: 14,
    marginTop: 4,
  },
  linkBold: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

const lightTheme: Theme = {
  container: { backgroundColor: '#f9fafe' },
  title: { color: '#111' },
  input: { borderColor: '#ccc', color: '#000', backgroundColor: '#fff' },
  button: { backgroundColor: '#007bff' },
  buttonText: { color: '#fff' },
  link: { color: '#007bff' },
  card: { backgroundColor: '#fff' },
};

const darkTheme: Theme = {
  container: { backgroundColor: '#121212' },
  title: { color: '#f4f4f4' },
  input: { borderColor: '#444', color: '#f4f4f4', backgroundColor: '#1e1e1e' },
  button: { backgroundColor: '#1e90ff' },
  buttonText: { color: '#fff' },
  link: { color: '#1e90ff' },
  card: { backgroundColor: '#1a1a1a' },
};

export default Login;
