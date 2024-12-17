import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HotelScreen = ({ navigation }) => {

    const navigateToEditRooms = () => {
        navigation.navigate('EditRoomScreen'); // Navigate to Rooms screen
    };

    const navigateToListRooms = () => {
        navigation.navigate('RoomListScreen'); // Navigate to Rooms screen
    };

    const navigateToRooms = () => {
        navigation.navigate('RoomScreen'); // Navigate to Rooms screen
    };

    const navigateToBookings = () => {
        navigation.navigate('BookingScreen'); // Navigate to Bookings screen
    };

    return (
        <View style={styles.container}>
            <Text>Welcome To Your Hotel</Text>
            <Button title="Manage Rooms" onPress={navigateToRooms} />
            <Button title="Manage Bookings" onPress={navigateToBookings} />
            <Button title="Manage Room List" onPress={navigateToListRooms} />
            {/* <Button title="Manage Room Edit" onPress={navigateToEditRooms} /> */}
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
