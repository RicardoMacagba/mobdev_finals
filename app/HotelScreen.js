import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HotelScreen = ({ navigation }) => {
    const navigateToRooms = () => {
        navigation.navigate('RoomScreen'); // Navigate to Rooms screen
    };

    const navigateToBookings = () => {
        navigation.navigate('Bookings'); // Navigate to Bookings screen
    };

    return (
        <View style={styles.container}>
            <Text>Welcome To Your Hotel</Text>
            <Button title="Manage Rooms" onPress={navigateToRooms} />
            <Button title="Manage Bookings" onPress={navigateToBookings} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
});

export default HotelScreen;
