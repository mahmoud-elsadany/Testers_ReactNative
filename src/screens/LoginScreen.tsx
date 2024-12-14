import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';




import { useNavigation } from '@react-navigation/native'; 
import strings from '../constants/strings';
import ApiService from '../services/ApiService';
import LocalStorageService from '../services/LocalStorageService';


const LoginScreen: React.FC = () => {
    const navigation = useNavigation(); // Access navigation
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

     useEffect(() => {
        const checkAccessToken = async () => {
            const token = await LocalStorageService.getAccessToken();
            if (token) {
                navigation.navigate('List'); 
            }
        };
        checkAccessToken();
    }, []);

    const handleLogin = async (): Promise<void> => {
        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('Error', strings.login.errorEmptyFields);
            return;
        }

        setIsLoading(true);

        try {
            const api = ApiService.getInstance();
            const response = await api.post('/login', { email, password });

            // handle Save tokens
            await LocalStorageService.saveTokens(response.access_token, response.refresh_token);

             // Navigate to the list screen after login
             navigation.navigate('List');

        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{strings.login.title}</Text>

            <TextInput
                style={styles.input}
                placeholder={strings.login.emailPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder={strings.login.passwordPlaceholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.iconContainer}
                >
                    <Image
                        source={
                            isPasswordVisible
                                ? require('../../assets/hide_password.png') // Show icon
                                : require('../../assets/show_password.png') // Hide icon
                        }
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ?  strings.login.loggingIn : strings.login.loginButton}</Text>
            </TouchableOpacity>


        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    inputPassword: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
    },
    iconContainer: {
        paddingHorizontal: 10,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    button: {
        height: 50,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


export default LoginScreen;
