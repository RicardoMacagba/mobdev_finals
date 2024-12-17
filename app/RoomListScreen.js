import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const RoomListScreen = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [token, setToken] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedUserInfo = await AsyncStorage.getItem('userInfo');
                if (storedUserInfo) {
                    const userInfo = JSON.parse(storedUserInfo);
                    setToken(userInfo.token);
                    fetchRooms(userInfo.token);
                }
            } catch (error) {
                console.error('Error loading token:', error);
                Alert.alert('Error', 'Failed to load authentication token.');
            }
        };

        loadToken();
    }, []);

    const fetchRooms = async (authToken) => {
        setIsFetching(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/listRooms`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.status === 200 && response.data.rooms) {
                setRooms(response.data.rooms);
            } else {
                Alert.alert('No Rooms Found', response.data.message || 'Could not fetch room data.');
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            Alert.alert('Error', 'An error occurred while fetching rooms.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleDelete = async (roomId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/deleteRoom/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Room deleted successfully.');
                fetchRooms(token); // Refresh the list
            } else {
                Alert.alert('Failed to Delete', response.data.message || 'Please try again.');
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            Alert.alert('Error', 'An error occurred while deleting the room.');
        }
    };

    const handleEdit = (room) => {
        navigation.navigate('EditRoomScreen', { room }); // Navigate to an EditRoom screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Room List</Text>
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id.toString()}
                refreshing={isFetching}
                onRefresh={() => fetchRooms(token)} // Pull-to-refresh
                renderItem={({ item }) => (
                    <View style={styles.roomCard}>
                        <Text style={styles.roomText}>Name: {item.name}</Text>
                        <Text style={styles.roomText}>Type: {item.type}</Text>
                        <Text style={styles.roomText}>Capacity: {item.capacity}</Text>
                        <Text style={styles.roomText}>Price: ₱{item.price}</Text>
                        <Text style={styles.roomText}>Status: {item.status}</Text>
                        {item.image && (
                            <Image
                                source={{ uri: `${API_BASE_URL}/storage/images/rooms/${item.image}` }}
                                style={styles.roomImage}
                            />
                        )}
                        <View style={styles.buttonContainer}>
                            <Button title="Edit" onPress={() => handleEdit(item)} />
                            <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
                        </View>
                    </View>
                )}
            />
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default RoomListScreen;
