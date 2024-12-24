import React from "react";
import ProfileScreen from "../screens/ProfileScreen";
import EditUserInfoScreen from "../screens/EditUserInfoScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from "../src/context/AuthContext";
const ProfileStack = createNativeStackNavigator();

export default function ProfileStackNavigator({ navigation, route }: { navigation: any; route: any }) {

    const { setToken } = useAuth();

    const handleLogout = () => {
        setToken(null);
    }


    return (
        <ProfileStack.Navigator initialRouteName="UserInfo" screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="UserInfo">
                {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </ProfileStack.Screen>
            <ProfileStack.Screen name="Edit" component={EditUserInfoScreen} />
        </ProfileStack.Navigator>
    );
}
