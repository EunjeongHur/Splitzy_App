import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";

export type GroupStackParamList = {
    GroupDetails: undefined;
    AddExpense: undefined;
};

const Stack = createStackNavigator<GroupStackParamList>();

export default function GroupStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="GroupDetails"
                component={GroupDetailsScreen}
                options={{ title: "Group Details" }}
            />
            <Stack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={{ title: "Add Expense" }}
            />
        </Stack.Navigator>
    );
}
