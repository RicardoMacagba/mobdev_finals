import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import BookingScreen from './BookingScreen';
import EditRoomScreen from './EditRoomScreen';
import HomeScreen from './HomeScreen';
import HotelScreen from './HotelScreen';
import LoginScreen from './LoginScreen'; // Ensure these are the correct paths to your screens
import ProfileUpdateScreen from './ProfileUpdateScreen';
import RegisterScreen from './RegisterScreen';
import RoomListScreen from './RoomListScreen';
import RoomScreen from './RoomScreen';
import SplashScreen from './SplashScreen'; // Import the SplashScreen component

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to show splash screen

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
      setLoading(false); // Stop loading after the check is complete
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return <SplashScreen />; // Show splash screen while checking login status
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Home' : 'Login'} // Dynamically set the initial route
          screenOptions={{
            headerBackVisible: false, // Globally disable back button (optional)
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false, // Optionally hide the header on the login screen
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerLeft: null, // Prevent back navigation on the Home screen
              gestureEnabled: false, // Disable swipe-to-go-back gesture
            }}
          />
          <Stack.Screen
            name="ProfileUpdate"
            component={ProfileUpdateScreen}
            options={{ title: 'Update Profile' }}
          />
          <Stack.Screen
            name="HotelScreen"
            component={HotelScreen}
            options={{ title: 'Hotel Rooms' }}
          />

          <Stack.Screen
            name="RoomScreen"
            component={RoomScreen}
            options={{ title: 'My Rooms' }}
          />

          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ title: 'Register' }}
          />

          <Stack.Screen
            name="BookingScreen"
            component={BookingScreen}
            options={{ title: 'Bookings' }}
          />

          <Stack.Screen
            name="RoomListScreen"
            component={RoomListScreen}
            options={{ title: 'Room List' }}
          />

          <Stack.Screen
            name="EditRoomScreen"
            component={EditRoomScreen}
            options={{ title: 'Room Edit' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
