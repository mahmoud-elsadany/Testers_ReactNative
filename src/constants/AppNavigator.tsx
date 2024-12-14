import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TestsListScreen from '../screens/TestsListScreen';
import strings from './strings';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="List"
                    component={TestsListScreen}
                    options={{ headerShown: false , title: strings.testsList.title }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
