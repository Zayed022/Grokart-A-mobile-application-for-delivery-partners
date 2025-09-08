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
  Platform,
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
  inputContainer: any;
  uploadButton: any;
  uploadText: any;
  submitButton: any;
  warningText: any;
  card: any;
  header: any;
  checkbox: any;
  checkboxText: any;
}

const Register = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

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
  const [detailsCorrect, setDetailsCorrect] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const theme = useMemo<Theme>(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

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
    if (!detailsCorrect) newErrors.detailsCorrect = 'Please confirm all details are correct';
    if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms and Conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, aadhaarProof, panCardProof, pucProof, licenseProof, detailsCorrect, agreeTerms]);

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
  name: file.fileName || `${key}.jpg`,
  type: file.type || 'image/jpeg',
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
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fields = useMemo(
    () => [
      { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
      { key: 'email', label: 'Email Address', placeholder: 'john@example.com' },
      { key: 'phone', label: 'Phone Number', placeholder: '9876543210' },
      { key: 'vehicleNumber', label: 'Vehicle Number', placeholder: 'MH12AB1234' },
      { key: 'licenseNumber', label: 'License Number', placeholder: 'LIC12345678' },
      { key: 'password', label: 'Password', placeholder: '••••••••', secure: true },
    ],
    []
  );

  const uploads = useMemo(
    () => [
      { label: 'Aadhaar Proof', file: aadhaarProof, setFile: setAadhaarProof, errorKey: 'aadhaarProof' },
      { label: 'PAN Card Proof', file: panCardProof, setFile: setPanCardProof, errorKey: 'panCardProof' },
      { label: 'PUC Proof', file: pucProof, setFile: setPucProof, errorKey: 'pucProof' },
      { label: 'License Proof', file: licenseProof, setFile: setLicenseProof, errorKey: 'licenseProof' },
    ],
    [aadhaarProof, panCardProof, pucProof, licenseProof]
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, theme.container]}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        <View style={[styles.header, theme.header]}>
          <Text style={[styles.title, theme.title]}>Become a Delivery Partner</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            accessibilityLabel="Toggle dark mode"
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#f4f6f8' : '#f4f4f4'}
          />
        </View>

        <View style={[styles.card, theme.card]}>
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
        </View>

        <View style={[styles.card, theme.card]}>
          <Text style={[styles.sectionTitle, theme.label]}>Document Uploads</Text>
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
        </View>

        <View style={[styles.card, theme.card]}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setDetailsCorrect(!detailsCorrect)}
            accessibilityLabel="Confirm details are correct"
          >
            <View style={[styles.checkbox, theme.checkbox, detailsCorrect && styles.checkboxChecked]}>
              {detailsCorrect && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxText, theme.checkboxText]}>
              All the details provided are correct and valid
            </Text>
          </TouchableOpacity>
          {errors.detailsCorrect && <Text style={styles.error}>{errors.detailsCorrect}</Text>}

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeTerms(!agreeTerms)}
              accessibilityLabel="Agree to Terms and Conditions"
            >
              <View style={[styles.checkbox, theme.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <Text style={[styles.checkboxText, theme.checkboxText]}>
              By clicking this, you agree to our{' '}
              <Text
                style={[styles.linkText, theme.checkboxText]}
                onPress={() => navigation.navigate('TermsAndConditions')}
              >
                Terms and Conditions
              </Text>
            </Text>
          </View>
          {errors.agreeTerms && <Text style={styles.error}>{errors.agreeTerms}</Text>}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.submitButton.backgroundColor}
            accessibilityLabel="Loading"
          />
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, theme.submitButton]}
            onPress={handleSubmit}
            accessibilityLabel="Register"
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Register Now</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.warningText, theme.warningText]}>
          ⚠️ Submitting false or inappropriate documents may lead to legal action.
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginLink}>
          <Text style={[styles.loginText, theme.label]}>Already have an account? Login</Text>
        </TouchableOpacity>
      </Animated.View>
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
}> = ({ label, placeholder, value, onChangeText, error, secureTextEntry, theme }) => {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, theme.label]}>{label}</Text>
      <View style={[styles.inputContainer, theme.inputContainer, error && styles.inputError]}>
        <TextInput
          style={[styles.input, theme.input]}
          placeholder={placeholder}
          placeholderTextColor={theme.input.placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          accessibilityLabel={label}
          autoCapitalize={label === 'Email Address' ? 'none' : 'sentences'}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// Reusable File Upload Component
const FileUpload: React.FC<{
  label: string;
  file: FileData | null;
  setFile: (file: FileData) => void;
  error?: string;
  handleFilePick: (setFile: (file: FileData) => void) => void;
  theme: Theme;
}> = ({ label, file, setFile, error, handleFilePick, theme }) => {
  return (
    <View style={styles.uploadBlock}>
      <Text style={[styles.label, theme.label]}>{label}</Text>
      <TouchableOpacity
        style={[styles.uploadButton, theme.uploadButton]}
        onPress={() => handleFilePick(setFile)}
        accessibilityLabel={`Upload ${label}`}
        activeOpacity={0.7}
      >
        <Text style={[styles.uploadText, theme.uploadText]}>
          {file ? 'Replace File' : 'Upload File'}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.uploadHint, theme.warningText]}>Supported: PNG, JPG, PDF</Text>
      {file && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: file.uri }} style={styles.previewImage} />
          <Text style={[styles.fileName, theme.label]} numberOfLines={1}>
            {file.fileName}
          </Text>
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// Common Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    padding: 12,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  uploadBlock: {
    marginBottom: 20,
  },
  uploadButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadHint: {
    fontSize: 12,
    marginTop: 8,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  fileName: {
    fontSize: 14,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  warningText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 16,
  },
  error: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

// Theme Styles
const baseTheme = {
  container: {},
  title: {},
  label: { fontWeight: '500' },
  input: {},
  inputContainer: {},
  uploadButton: {},
  uploadText: {},
  submitButton: {},
  warningText: {},
  card: {},
  header: {},
  checkbox: {},
  checkboxText: {},
};

const lightTheme: Theme = {
  ...baseTheme,
  container: { backgroundColor: '#f8fafc' },
  header: { backgroundColor: 'transparent' },
  card: { backgroundColor: '#ffffff', borderColor: '#e5e7eb' },
  title: { color: '#1e293b' },
  label: { color: '#475569' },
  inputContainer: { borderColor: '#d1d5db', backgroundColor: '#ffffff' },
  input: { color: '#1e293b', placeholderTextColor: '#9ca3af' },
  uploadButton: { backgroundColor: '#e5e7eb' },
  uploadText: { color: '#1e293b' },
  submitButton: { backgroundColor: '#3b82f6' },
  warningText: { color: '#64748b' },
  checkbox: { borderColor: '#d1d5db' },
  checkboxText: { color: '#475569' },
};

const darkTheme: Theme = {
  ...baseTheme,
  container: { backgroundColor: '#0f172a' },
  header: { backgroundColor: 'transparent' },
  card: { backgroundColor: '#1e293b', borderColor: '#334155' },
  title: { color: '#f1f5f9' },
  label: { color: '#cbd5e1' },
  inputContainer: { borderColor: '#475569', backgroundColor: '#2d3748' },
  input: { color: '#f1f5f9', placeholderTextColor: '#94a3b8' },
  uploadButton: { backgroundColor: '#475569' },
  uploadText: { color: '#f1f5f9' },
  submitButton: { backgroundColor: '#60a5fa' },
  warningText: { color: '#94a3b8' },
  checkbox: { borderColor: '#475569' },
  checkboxText: { color: '#cbd5e1' },
};

export default Register;