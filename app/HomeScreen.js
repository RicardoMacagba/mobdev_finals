import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); // Clear auth token
    Alert.alert('Logged out', 'You have been logged out successfully.');
    navigation.replace('Login'); // Navigate to login screen
  };

  const navigateToProfileUpdate = () => {
    navigation.navigate('ProfileUpdate'); // Navigate to ProfileUpdateScreen
  };

  const navigateToHotelScreen = () => {
    navigation.navigate('HotelScreen'); // Navigate to HotelManagementScreen
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Update Profile" onPress={navigateToProfileUpdate} />
      <Button title="Hotel Management" onPress={navigateToHotelScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
});

export default HomeScreen;
