import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import HomeScreen from "../screens/HomeScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const GroupStack = createNativeStackNavigator();

export default function GroupStackNavigator({ navigation, route }: { navigation: any; route: any }) {
    return (
        <GroupStack.Navigator initialRouteName="GroupLists" screenOptions={{ headerShown: false }}>
            <GroupStack.Screen name="GroupLists" component={HomeScreen} />
            <GroupStack.Screen name="GroupDetails" component={GroupDetailsScreen} />
            <GroupStack.Screen name="CreateGroup" component={CreateGroupScreen} />
            <GroupStack.Screen name="AddExpense" component={AddExpenseScreen} />
        </GroupStack.Navigator>
    );
}
