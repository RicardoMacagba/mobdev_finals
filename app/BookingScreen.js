import React, { useState } from 'react';
import { Alert, Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';

const BookingScreen = () => {
    const [bookings, setBookings] = useState([
        {
            booking_id: 1,
            room_id: 101,
            customer_name: 'John Doe',
            booking_date: '2024-12-20',
            image_url: 'https://plus.unsplash.com/premium_photo-1676823547752-1d24e8597047?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D', // Example image path
        },
        {
            booking_id: 2,
            room_id: 102,
            customer_name: 'Jane Smith',
            booking_date: '2024-12-21',
            image_url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?cs=srgb&dl=pexels-jvdm-1457842.jpg&fm=jpg',
        },
        {
            booking_id: 3,
            room_id: 103,
            customer_name: 'Alice Johnson',
            booking_date: '2024-12-22',
            image_url: 'https://www.thespruce.com/thmb/2_Q52GK3rayV1wnqm6vyBvgI3Ew=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg',
        },
    ]);

    const [newBooking, setNewBooking] = useState({
        roomId: '',
        customerName: '',
        bookingDate: '',
        imageUri: null,
    });

    // Handle Add Booking
    const handleAddBooking = () => {
        const { roomId, customerName, bookingDate, imageUri } = newBooking;
        if (!roomId || !customerName || !bookingDate) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }

        const newId = bookings.length ? bookings[bookings.length - 1].booking_id + 1 : 1;
        const newBookingEntry = {
            booking_id: newId,
            room_id: parseInt(roomId, 10),
            customer_name: customerName,
            booking_date: bookingDate,
            image_url: imageUri ? { uri: imageUri } : require('../assets/picture/room1.jpg'),
        };

        setBookings([...bookings, newBookingEntry]);
        setNewBooking({ roomId: '', customerName: '', bookingDate: '', imageUri: null });
        Alert.alert('Success', 'Booking added successfully!');
    };

    // Handle Delete Booking
    const handleDeleteBooking = (bookingId) => {
        const updatedBookings = bookings.filter((booking) => booking.booking_id !== bookingId);
        setBookings(updatedBookings);
        Alert.alert('Success', 'Booking deleted successfully!');
    };

    // Render Booking Item
    const renderBookingItem = ({ item }) => (
        <View style={styles.bookingItem}>
            <Image
                source={{ uri: item.image_url }}
                style={styles.bookingImage}
                //defaultSource={require('../assets/default-room.jpg')} // Fallback image
            />
            <Text style={styles.bookingDetails}>Room ID: {item.room_id}</Text>
            <Text style={styles.bookingDetails}>Customer: {item.customer_name}</Text>
            <Text style={styles.bookingDetails}>Date: {item.booking_date}</Text>
            <View style={styles.adminActions}>
                <Button title="Delete" color="red" onPress={() => handleDeleteBooking(item.booking_id)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bookings</Text>

            {/* Booking List */}
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.booking_id.toString()}
                renderItem={renderBookingItem}
            />

            {/* Add Booking Form */}
            <View style={styles.addBookingContainer}>
                <Text style={styles.subTitle}>Add New Booking</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Room ID"
                    keyboardType="numeric"
                    value={newBooking.roomId}
                    onChangeText={(text) => setNewBooking({ ...newBooking, roomId: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Customer Name"
                    value={newBooking.customerName}
                    onChangeText={(text) => setNewBooking({ ...newBooking, customerName: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Booking Date (YYYY-MM-DD)"
                    value={newBooking.bookingDate}
                    onChangeText={(text) => setNewBooking({ ...newBooking, bookingDate: text })}
                />
                <Button
                    title="Add Booking"
                    onPress={handleAddBooking}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    bookingItem: {
        marginBottom: 15,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    bookingImage: {
        width: '100%',
        height: 150,
        borderRadius: 5,
        marginBottom: 10,
    },
    bookingDetails: {
        fontSize: 16,
        marginBottom: 5,
    },
    adminActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    addBookingContainer: {
        marginTop: 20,
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        paddingTop: 20,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default BookingScreen;
