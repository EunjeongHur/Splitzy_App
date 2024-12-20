import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InvitationScreen from "../screens/InvitationScreen";
import GroupStackNavigator from "./GroupStackNagivator";
import ExpenseSummaryScreen from "../screens/ExpenseSummaryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuth } from '../src/context/AuthContext';
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { setToken } = useAuth();

    const handleLogout = () => {
        setToken(null);
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = "";
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Summary") {
                        iconName = focused ? "list" : "list-outline";
                    } else if (route.name === "Invitation") {
                        iconName = focused ? "mail" : "mail-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#282a35",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    paddingBottom: 4,
                    paddingTop: 4,
                    height: 60,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home">
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
