import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ActivityIndicator,
    TextInput,
} from 'react-native';

import strings from '../constants/strings';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import LocalStorageService from '../services/LocalStorageService';

const TestsListScreen: React.FC = () => {
    const navigation = useNavigation();
    const [moderatedTests, setModeratedTests] = useState([]);
    const [unmoderatedTests, setUnmoderatedTests] = useState([]);
    const [filteredModeratedTests, setFilteredModeratedTests] = useState([]);
    const [filteredUnmoderatedTests, setFilteredUnmoderatedTests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getAllTests = async () => {
            try {
                const token = await LocalStorageService.getAccessToken();

                const api = ApiService.getInstance();
                const response = await api.get('/tests', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('testsResponse', response);

                setModeratedTests(response.data.mod_rut_tests || []);
                setUnmoderatedTests(response.data.standard_tests || []);
                setFilteredModeratedTests(response.data.mod_rut_tests || []);
                setFilteredUnmoderatedTests(response.data.standard_tests || []);
            } catch (error: any) {
                Alert.alert('Failed to Fetch Tests', error.response?.data?.message || error.message);
            } finally {
                setIsLoading(false);
            }
        };

        getAllTests();
    }, []);

    const handleLogout = () => {
        Alert.alert('Logout', strings.testsList.messagelogout, [
            {
                text: strings.testsList.cancel,
                style: 'cancel',
            },
            {
                text: strings.testsList.logout,
                onPress: () => {
                    LocalStorageService.clearTokens();
                    navigation.navigate('Login');
                },
            },
        ]);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredModeratedTests(moderatedTests);
            setFilteredUnmoderatedTests(unmoderatedTests);
            return;
        }

        const filteredModerated = moderatedTests.filter((test) =>
            test.test_type.toLowerCase().includes(query.toLowerCase()) ||
            test.device_name.toLowerCase().includes(query.toLowerCase())
        );
        const filteredUnmoderated = unmoderatedTests.filter((test) =>
            test.test_type.toLowerCase().includes(query.toLowerCase()) ||
            test.device_name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredModeratedTests(filteredModerated);
        setFilteredUnmoderatedTests(filteredUnmoderated);
    };

    const renderTestItem = ({ item }) => (
        <View style={styles.testCard}>
            <Text>{strings.testsList.device}: {item.device_name}</Text>
            <Text>{strings.testsList.duration}: {item.testDuration} mins</Text>
            <Text>{strings.testsList.fee}: ${item.fee}</Text>
            {item.extra_requirements?.length > 0 && (
                <View>
                    <Text style={styles.requirementsTitle}>Requirements:</Text>
                    {item.extra_requirements.map((req, index) => (
                        <Text key={index} style={styles.requirementText}>
                            - {req}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>{strings.testsList.testsLoading}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{strings.testsList.title}</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>{strings.testsList.logout}</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder={strings.testsList.search}
                value={searchQuery}
                onChangeText={handleSearch}
            />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{strings.testsList.ModeratedTests}</Text>
                {filteredModeratedTests.length > 0 ? (
                    <FlatList
                        data={filteredModeratedTests}
                        keyExtractor={(item, index) => `mod-${index}`}
                        renderItem={renderTestItem}
                    />
                ) : (
                    <Text style={styles.noTests}>{strings.testsList.NoModeratedTests}</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{strings.testsList.UnModeratedTests}</Text>
                {filteredUnmoderatedTests.length > 0 ? (
                    <FlatList
                        data={filteredUnmoderatedTests}
                        keyExtractor={(item, index) => `unmod-${index}`}
                        renderItem={renderTestItem}
                    />
                ) : (
                    <Text style={styles.noTests}>{strings.testsList.NoUnModeratedTests}</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#007bff',
    },
    headerTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 10,
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    section: {
        margin: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noTests: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10,
    },
    testCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    testType: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    requirementsTitle: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },
    requirementText: {
        fontSize: 14,
        color: '#555',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginBottom: 5,
        marginTop:10,
        backgroundColor: '#fff',
    },
});

export default TestsListScreen;
