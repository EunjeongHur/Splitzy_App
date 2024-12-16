import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const HomeStack = createNativeStackNavigator();

export default function HomeStackNavigator({ navigation, route }: { navigation: any; route: any }) {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="CreateGroup" component={CreateGroupScreen} />
        </HomeStack.Navigator>
    );
}
