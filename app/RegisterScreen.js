import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [imageUri, setImageUri] = useState(null); // Profile image state


    // Pick a profile image
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.photo],  // Updated to use MediaType instead of MediaTypeOptions
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // Set the selected image URI
        }
    };

    // Handle the registration process
    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !repassword.trim()) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        if (password !== repassword) {
            Alert.alert('Validation Error', 'Passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('email', email.trim());
        formData.append('password', password.trim());

        // if (imageUri) {
        //     formData.append('profilePicture', {
        //         uri: imageUri,
        //         name: 'profile.jpg',
        //         type: 'image/jpeg',
        //     });
        // }

        try {
            const response = await axios.post(`${API_BASE_URL}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Registration response:', response.data);

            if (response.data.token) {
                const userInfo = {
                    token: response.data.token,
                    userId: response.data.user.user_id, // Assuming the response includes a user object with ID
                    email: response.data.user.email, // Assuming email is included
                };

                // Store user info in AsyncStorage
                await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

                Alert.alert('Registration Successful', `Welcome, ${userInfo.email}`);
                navigation.navigate('Home');
            } else {
                Alert.alert('Registration Failed', 'Something went wrong.');
                console.log(user.email);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong during registration.');
            if (axios.isAxiosError(error)) {
                console.error('Axios Error Details:');
                console.error('Message:', error.message);
            }
        }
    };
    const navigateToLogin = () => {
        navigation.navigate('Login'); // Navigate to Lohin
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            {/* Username Field */}
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            {/* Email Field */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Password Field */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* Confirm Password Field */}
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={repassword}
                onChangeText={setRepassword}
            />

            {/* Profile Picture Picker */}
            <Button title="Pick Profile Picture" onPress={pickImage} />
            {imageUri && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                </View>
            )}

            {/* Register Button */}
            <Button title="Register" onPress={handleRegister} />

            {/* Navigation to Login */}

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Already have an account?</Text>
                <Button title="Login" onPress={navigateToLogin}></Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        marginTop: 20,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 16,
        color: '#555',
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
});

export default RegisterScreen;
