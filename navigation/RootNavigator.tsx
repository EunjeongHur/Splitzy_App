import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from '../src/context/AuthContext';

const RootNavigator = () => {
    const { isAuthenticated } = useAuth();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

export default RootNavigator;
