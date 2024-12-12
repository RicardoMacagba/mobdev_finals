import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.token) {
        const userInfo = {
          token: response.data.token,
          userId: response.data.user.user_id, // Assuming the response includes a user object with ID
          email: response.data.user.email, // Assuming email is included
        };

        // Store user info in AsyncStorage
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

        Alert.alert('Login Successful', `Welcome back, ${userInfo.email}`);
        navigation.navigate('Home');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during login.');
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:');
        console.error('Message:', error.message);
      }
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('RegisterScreen'); // Navigate to RegisterScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.registerLink}> Sign up here.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#555',
  },
  registerLink: {
    fontSize: 16,
    color: '#1E90FF',
  },
});

export default LoginScreen;
