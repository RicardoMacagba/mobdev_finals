import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const RoomScreen = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [name, setRoomName] = useState('');
    const [type, setRoomType] = useState('');
    const [capacity, setRoomCapacity] = useState('');
    const [price, setprice] = useState('');
    const [status, setRoomStatus] = useState('available');
    const [imageUri, setImageUri] = useState(null);
    const [token, setToken] = useState(null);

    // Load token from AsyncStorage on mount
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedUserInfo = await AsyncStorage.getItem('userInfo');
                if (storedUserInfo) {
                    const userInfo = JSON.parse(storedUserInfo);
                    setToken(userInfo.token);
                    console.log(userInfo.token);
                }
            } catch (error) {
                console.error('Error loading token:', error);
            }
        };
        loadToken();
        fetchRooms(); // Initial fetch of rooms
    }, []);

    // Fetch rooms from the API
    const fetchRooms = async () => {
        try {
            if (!token) {
                console.warn('Token not available. Please log in again.');
                Alert.alert('Authentication Error', 'Please log in again to fetch room data.');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/listRooms`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 && response.data.rooms) {
                setRooms(response.data.rooms);
            } else {
                Alert.alert('No Rooms Found', response.data.message || 'Could not fetch room data.');
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            Alert.alert('Error', error.response?.data?.message || 'An error occurred while fetching rooms.');
        }
    };


    // Pick an image for the room
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Add a new room
    const addRoom = async () => {
        if (!name || !price || !imageUri) {
            Alert.alert('Validation Error', 'Room name, price, and image are required.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('capacity', capacity);
        formData.append('price', price);
        formData.append('status', status);
        formData.append('room_image', {
            uri: imageUri,
            name: 'room.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await axios.post(`${API_BASE_URL}/addRooms`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Room added successfully.');
                fetchRooms(); // Refresh the room list
                clearForm(); // Clear form inputs
            } else {
                Alert.alert('Failed to Add Room', response.data.message || 'Please try again.');
                //clearForm();
            }
        } catch (error) {
            console.error('Error adding room:', error);
            Alert.alert('Error', 'An error occurred while adding the room.');
        }
    };

    // Clear form inputs
    const clearForm = () => {
        setRoomName('');
        setRoomType('');
        setRoomCapacity('');
        setprice('');
        setRoomStatus('available');
        setImageUri(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Room Management</Text>

            {/* Room List */}
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id.toString()}
                refreshing={isFetching} // state variable to control refreshing
                onRefresh={fetchRooms} // Refresh data when pulled
                renderItem={({ item }) => (
                    <View style={styles.roomCard}>
                        <Text style={styles.roomText}>Name: {item.name}</Text>
                        <Text style={styles.roomText}>Type: {item.type}</Text>
                        <Text style={styles.roomText}>Capacity: {item.capacity}</Text>
                        <Text style={styles.roomText}>Price: ${item.price}</Text>
                        <Text style={styles.roomText}>Status: {item.status}</Text>
                        {item.image_url && (
                            <Image
                                source={{ uri: item.image_url }}
                                style={styles.roomImage}
                            />
                        )}
                    </View>
                )}
            />


            {/* Add Room Form */}
            <TextInput
                style={styles.input}
                placeholder="Room Name"
                value={name}
                onChangeText={setRoomName}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Type (optional)"
                value={type}
                onChangeText={setRoomType}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Capacity (optional)"
                value={capacity}
                keyboardType="numeric"
                onChangeText={setRoomCapacity}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Price"
                value={price}
                keyboardType="numeric"
                onChangeText={setprice}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Status (default: available)"
                value={status}
                onChangeText={setRoomStatus}
            />
            <Button title="Pick Room Image" onPress={pickImage} />
            {imageUri && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                </View>
            )}
            <Button title="Add Room" onPress={addRoom} />
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
        textAlign: 'center',
    },
    roomCard: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    roomText: {
        fontSize: 16,
        marginBottom: 5,
    },
    roomImage: {
        width: '100%',
        height: 150,
        marginTop: 10,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default RoomScreen;
