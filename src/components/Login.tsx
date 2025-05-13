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
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigation types
type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Form data interface
interface FormData {
  email: string;
  password: string;
}

// Theme interface
interface Theme {
  container: any;
  title: any;
  input: any;
  button: any;
  buttonText: any;
  link: any;
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

      // Log the API response for debugging
      console.log('API Response:', JSON.stringify(res.data, null, 2));

      if (res.data?.data?.deliveryPartner) {
        Alert.alert('Success', 'Login successful');
        // Navigate after a slight delay to ensure alert renders
        setTimeout(() => {
          console.log('Navigating to Home');
          navigation.navigate('Home');
        }, 500);
      } else {
        console.warn('Unexpected response structure:', res.data);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login Error:', err.response?.data || err.message);
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

  const inputs = useMemo(
    () => [
      {
        key: 'email' as keyof FormData,
        placeholder: 'Email',
        autoCapitalize: 'none' as 'none',
        secureTextEntry: false,
      },
      {
        key: 'password' as keyof FormData,
        placeholder: 'Password',
        autoCapitalize: 'none' as 'none',
        secureTextEntry: true,
      },
    ],
    []
  );

  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.title, theme.title]}>Delivery Partner Login</Text>

      {inputs.map(({ key, placeholder, autoCapitalize, secureTextEntry }) => (
        <InputField
          key={key}
          placeholder={placeholder}
          value={form[key]}
          onChangeText={(value) => handleInputChange(key, value)}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          theme={theme}
        />
      ))}

      <Button
        title="Login"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        theme={theme}
      />

      {/* Temporary button to test navigation */}
      <TouchableOpacity
        style={[styles.button, theme.button]}
        onPress={() => {
          console.log('Testing navigation to Home');
          navigation.navigate('Home');
        }}
        accessibilityLabel="Test Navigate to Home"
      >
        <Text style={[styles.buttonText, theme.buttonText]}>Test Navigate to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        accessibilityLabel="Navigate to Register"
      >
        <Text style={[styles.link, theme.link]}>Don't have an account? Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        accessibilityLabel="Navigate to Home"
      >
        <Text style={[styles.link, theme.link]}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

// Reusable Input Field Component
const InputField: React.FC<{
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  autoCapitalize: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  theme: Theme;
}> = ({ placeholder, value, onChangeText, autoCapitalize, secureTextEntry, theme }) => (
  <TextInput
    style={[styles.input, theme.input]}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    autoCapitalize={autoCapitalize}
    secureTextEntry={secureTextEntry}
    placeholderTextColor={theme.input.color}
    accessibilityLabel={placeholder}
  />
);

// Reusable Button Component
const Button: React.FC<{
  title: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
  theme: Theme;
}> = ({ title, onPress, loading, disabled, theme }) => (
  <TouchableOpacity
    style={[styles.button, theme.button, disabled && styles.disabledButton]}
    onPress={onPress}
    disabled={disabled}
    accessibilityLabel={title}
  >
    {loading ? (
      <ActivityIndicator color={theme.buttonText.color} accessibilityLabel="Loading" />
    ) : (
      <Text style={[styles.buttonText, theme.buttonText]}>{title}</Text>
    )}
  </TouchableOpacity>
);

// Common Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

// Theme Styles
const baseTheme = {
  container: {},
  title: {},
  input: {},
  button: {},
  buttonText: {},
  link: {},
};

const lightTheme: Theme = {
  ...baseTheme,
  container: { backgroundColor: '#fff' },
  title: { color: '#111' },
  input: { borderColor: '#ccc', color: '#111', backgroundColor: '#f4f6f8' },
  button: { backgroundColor: '#2196f3' },
  buttonText: { color: '#fff' },
  link: { color: '#2196f3' },
};

const darkTheme: Theme = {
  ...baseTheme,
  container: { backgroundColor: '#121212' },
  title: { color: '#f4f4f4' },
  input: { borderColor: '#555', color: '#f4f4f4', backgroundColor: '#1e1e1e' },
  button: { backgroundColor: '#1e90ff' },
  buttonText: { color: '#fff' },
  link: { color: '#1e90ff' },
};

export default Login;