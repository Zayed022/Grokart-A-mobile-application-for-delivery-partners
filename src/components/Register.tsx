import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Animated,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleNumber: string;
  licenseNumber: string;
}

interface FileData {
  uri: string;
  fileName: string;
  type: string;
}

interface Theme {
  container: any;
  title: any;
  label: any;
  input: any;
  uploadButton: any;
  uploadText: any;
  submitButton: any;
  warningText: any;
}

const Register = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation<any>();

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleNumber: '',
    licenseNumber: '',
  });

  const [errors, setErrors] = useState<Partial<FormData & { [key: string]: string }>>({});
  const [aadhaarProof, setAadhaarProof] = useState<FileData | null>(null);
  const [panCardProof, setPanCardProof] = useState<FileData | null>(null);
  const [pucProof, setPucProof] = useState<FileData | null>(null);
  const [licenseProof, setLicenseProof] = useState<FileData | null>(null);

  const theme = useMemo<Theme>(() => darkMode ? darkTheme : lightTheme, [darkMode]);

  const validateFields = useCallback(() => {
    const newErrors: Partial<FormData & { [key: string]: string }> = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.phone) newErrors.phone = 'Phone is required';
    if (!form.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!form.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!aadhaarProof) newErrors.aadhaarProof = 'Aadhaar proof is required';
    if (!panCardProof) newErrors.panCardProof = 'PAN card proof is required';
    if (!pucProof) newErrors.pucProof = 'PUC proof is required';
    if (!licenseProof) newErrors.licenseProof = 'License proof is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, aadhaarProof, panCardProof, pucProof, licenseProof]);

  const handleFilePick = useCallback(async (setFile: (file: FileData) => void) => {
    const result = await launchImageLibrary({ mediaType: 'mixed' });
    if (!result.didCancel && result.assets && result.assets[0]) {
      setFile(result.assets[0]);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateFields()) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    
    const files = [
      { key: 'aadhaarProof', file: aadhaarProof },
      { key: 'panCardProof', file: panCardProof },
      { key: 'pucProof', file: pucProof },
      { key: 'licenseProof', file: licenseProof },
    ];

    files.forEach(({ key, file }) => {
      if (file) {
        data.append(key, {
          uri: file.uri,
          name: file.fileName,
          type: file.type,
        });
      }
    });

    try {
      setLoading(true);
      const res = await axios.post('https://grokart-2.onrender.com/api/v1/delivery/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        
      });

      if (res.data.success) {
  navigation.navigate("Login");
  Alert.alert("Success", "Registration successful");
}

    } catch (error: any) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', 'Registration failed');
    } finally {
      setLoading(false);
    }
  }, [form, aadhaarProof, panCardProof, pucProof, licenseProof, validateFields, navigation]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fields = useMemo(() => [
    { key: 'name', label: 'Enter your name', placeholder: 'John Doe' },
    { key: 'email', label: 'Enter your email', placeholder: 'john@example.com' },
    { key: 'phone', label: 'Enter your phone number', placeholder: '9876543210' },
    { key: 'vehicleNumber', label: 'Enter your vehicle number', placeholder: 'MH12AB1234' },
    { key: 'licenseNumber', label: 'Enter your license number', placeholder: 'LIC12345678' },
    { key: 'password', label: 'Enter your password', placeholder: '*******', secure: true },
  ], []);

  const uploads = useMemo(() => [
    { label: 'Aadhaar Proof', file: aadhaarProof, setFile: setAadhaarProof, errorKey: 'aadhaarProof' },
    { label: 'PAN Card Proof', file: panCardProof, setFile: setPanCardProof, errorKey: 'panCardProof' },
    { label: 'PUC Proof', file: pucProof, setFile: setPucProof, errorKey: 'pucProof' },
    { label: 'License Proof', file: licenseProof, setFile: setLicenseProof, errorKey: 'licenseProof' },
  ], [aadhaarProof, panCardProof, pucProof, licenseProof]);

  return (
    <ScrollView contentContainerStyle={[styles.container, theme.container]}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={[styles.title, theme.title]}>Register Delivery Partner</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            accessibilityLabel="Toggle dark mode"
          />
        </View>

        {fields.map(({ key, label, placeholder, secure }) => (
          <InputField
            key={key}
            label={label}
            placeholder={placeholder}
            value={form[key as keyof FormData]}
            onChangeText={(val) => setForm({ ...form, [key]: val })}
            error={errors[key]}
            secureTextEntry={secure}
            theme={theme}
          />
        ))}

        {uploads.map(({ label, file, setFile, errorKey }) => (
          <FileUpload
            key={label}
            label={label}
            file={file}
            setFile={setFile}
            error={errors[errorKey]}
            handleFilePick={handleFilePick}
            theme={theme}
          />
        ))}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={darkMode ? '#fff' : '#000'}
            accessibilityLabel="Loading"
          />
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, theme.submitButton]}
            onPress={handleSubmit}
            accessibilityLabel="Register"
          >
            <Text style={styles.submitText}>Register</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.warningText, theme.warningText]}>
          ⚠️ Submitting false or inappropriate documents may lead to legal action.
        </Text>
      </Animated.View>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text >Already have an account? Login</Text>
            </TouchableOpacity>
    </ScrollView>
  );
};

// Reusable Input Field Component
const InputField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (val: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  theme: Theme;
}> = ({ label, placeholder, value, onChangeText, error, secureTextEntry, theme }) => (
  <View style={styles.fieldGroup}>
    <Text style={theme.label}>{label}</Text>
    <TextInput
      style={[styles.input, theme.input]}
      placeholder={placeholder}
      placeholderTextColor={theme.input.color}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      accessibilityLabel={label}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

// Reusable File Upload Component
const FileUpload: React.FC<{
  label: string;
  file: FileData | null;
  setFile: (file: FileData) => void;
  error?: string;
  handleFilePick: (setFile: (file: FileData) => void) => void;
  theme: Theme;
}> = ({ label, file, setFile, error, handleFilePick, theme }) => (
  <View style={styles.uploadBlock}>
    <Text style={theme.label}>{label} (Supported: png, jpg, pdf)</Text>
    <TouchableOpacity
      style={[styles.uploadButton, theme.uploadButton]}
      onPress={() => handleFilePick(setFile)}
      accessibilityLabel={`Upload ${label}`}
    >
      <Text style={theme.uploadText}>Choose File</Text>
    </TouchableOpacity>
    {error && <Text style={styles.error}>{error}</Text>}
    {file && <Image source={{ uri: file.uri }} style={styles.previewImage} />}
  </View>
);

// Common Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  animatedContainer: {
    transform: [{ scale: 1 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  uploadBlock: {
    marginBottom: 14,
  },
  uploadButton: {
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
    marginTop: 8,
    borderRadius: 10,
  },
  submitButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    marginTop: 24,
    fontSize: 12,
    textAlign: 'center',
  },
  error: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 4,
  },
});

// Theme Styles
const baseTheme = {
  container: {},
  title: {},
  label: { fontWeight: '600' },
  input: {},
  uploadButton: {},
  uploadText: {},
  submitButton: {},
  warningText: {},
};

const lightTheme: Theme = {
  ...baseTheme,
  container: { backgroundColor: '#f4f6f8' },
  title: { color: '#111' },
  label: { color: '#333' },
  input: { borderColor: '#ccc', backgroundColor: '#fff', color: '#111' },
  uploadButton: { backgroundColor: '#eee' },
  uploadText: { color: '#333' },
  submitButton: { backgroundColor: '#007BFF' },
  warningText: { color: '#444' },
};

const darkTheme: Theme = {
  ...baseTheme,
  container: { backgroundColor: '#121212' },
  title: { color: '#f4f4f4' },
  label: { color: '#ddd' },
  input: { borderColor: '#555', backgroundColor: '#1e1e1e', color: '#f4f4f4' },
  uploadButton: { backgroundColor: '#333' },
  uploadText: { color: '#fff' },
  submitButton: { backgroundColor: '#1e90ff' },
  warningText: { color: '#bbb' },
};

export default Register;