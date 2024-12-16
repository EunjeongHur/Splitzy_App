import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator";
import GroupStackNavigator from "./GroupStackNagivator";
import ExpenseSummaryScreen from "../screens/ExpenseSummaryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ onLogout }: { onLogout: () => void }) => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home">
                {(props) => <HomeStackNavigator {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Groups">
                {(props) => <GroupStackNavigator {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Summary" component={ExpenseSummaryScreen} />
            <Tab.Screen name="Profile">
                {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default TabNavigator;
