import axios from 'axios';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const RoomScreen = () => {
    //const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({
        name: '',
        type: '',
        price: '',
    });

    const addRoom = async () => {
        if (!newRoom.name || !newRoom.type || !newRoom.price) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/add_rooms`, {
                headers: { 'Content-Type': 'application/json' },
            });
            Alert.alert('Success', response.data.message);
            //fetchRooms(); // Refresh room list
            setNewRoom({ name: '', type: '', price: '' }); // Clear form
        } catch (error) {
            console.error('Error adding room:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Room Management</Text>
            <FlatList
                data={newRoom}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text>
                        {item.name} - {item.type} - ${item.price}
                    </Text>
                )}
            />

            <Text style={styles.subtitle}>Add New Room</Text>
            <TextInput
                style={styles.input}
                placeholder="Room Name"
                value={newRoom.name}
                onChangeText={(text) => setNewRoom({ ...newRoom, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Room Type"
                value={newRoom.type}
                onChangeText={(text) => setNewRoom({ ...newRoom, type: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={newRoom.price}
                onChangeText={(text) => setNewRoom({ ...newRoom, price: text })}
            />
            <Button title="Add Room" onPress={addRoom} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default RoomScreen;
