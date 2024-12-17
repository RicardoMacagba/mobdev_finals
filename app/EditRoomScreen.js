import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const EditRoomScreen = ({ route, navigation }) => {
    const { room } = route.params; // Get the room data from the route parameters
    const [name, setRoomName] = useState(room.name);
    const [type, setRoomType] = useState(room.type || '');
    const [capacity, setRoomCapacity] = useState(room.capacity || '');
    const [price, setRoomPrice] = useState(room.price || '');
    const [status, setRoomStatus] = useState(room.status || 'available');
    const [imageUri, setImageUri] = useState(null); // New image, if selected
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedUserInfo = await AsyncStorage.getItem('userInfo');
                if (storedUserInfo) {
                    const userInfo = JSON.parse(storedUserInfo);
                    setToken(userInfo.token);
                }
            } catch (error) {
                console.error('Error loading token:', error);
                Alert.alert('Error', 'Failed to load authentication token.');
            }
        };

        loadToken();
    }, []);

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

    const handleUpdate = async () => {
        if (!name || !price) {
            Alert.alert('Validation Error', 'Room name and price are required.');
            return;
        }

        if (!token) {
            Alert.alert('Error', 'Authentication token is missing. Please try again.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('capacity', capacity || 0);
        formData.append('price', price || 0);
        formData.append('status', status);

        if (imageUri) {
            formData.append('room_image', {
                uri: imageUri,
                name: 'room.jpg',
                type: 'image/jpeg',
            });
        }

        try {
            const response = await axios.putForm(`${API_BASE_URL}/updateRoom/${room.id}`, formData, {
                
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                
            });
            //console.log(`${API_BASE_URL}/api/editRoom/${room.id}`);

            if (response.status === 200) {
                Alert.alert('Success', 'Room updated successfully.');
                navigation.goBack(); // Navigate back to the Room List Screen
            } else {
                Alert.alert('Failed to Update Room', response.data.message || 'Please try again.');
            }
        } catch (error) {
            console.error('Error updating room:', error.response?.data || error.message);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'An error occurred while updating the room.'
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Room</Text>
            <TextInput
                style={styles.input}
                placeholder="Room Name"
                value={name}
                onChangeText={setRoomName}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Type"
                value={type}
                onChangeText={setRoomType}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Capacity"
                value={capacity}
                keyboardType="numeric"
                onChangeText={setRoomCapacity}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Price"
                value={price}
                keyboardType="numeric"
                onChangeText={setRoomPrice}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Status (default: available)"
                value={status}
                onChangeText={setRoomStatus}
            />
            <Button title="Pick New Room Image" onPress={pickImage} />
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : room.image ? (
                <Image
                    source={{ uri: `${API_BASE_URL}/storage/images/rooms/${room.image}` }}
                    style={styles.imagePreview}
                />
            ) : null}
            <Button title="Update Room" onPress={handleUpdate} />
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
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        marginVertical: 15,
    },
});

export default EditRoomScreen;
