import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InvitationScreen from "../screens/InvitationScreen";
import GroupStackNavigator from "./GroupStackNagivator";
import ExpenseSummaryScreen from "../screens/ExpenseSummaryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuth } from '../src/context/AuthContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { setToken } = useAuth();

    const handleLogout = () => {
        setToken(null);
    }

    return (
        <Tab.Navigator initialRouteName="Groups" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Groups">
                {(props) => <GroupStackNavigator {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Summary" component={ExpenseSummaryScreen} />
            <Tab.Screen name="Invitation" component={InvitationScreen} />
            <Tab.Screen name="Profile">
                {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default TabNavigator;
