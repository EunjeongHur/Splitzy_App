import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";

export type GroupStackParamList = {
    GroupDetails: undefined;
    AddExpense: undefined;
};

const GroupStack = createStackNavigator();

export default function GroupStackNavigator() {
    return (
        <GroupStack.Navigator initialRouteName="GroupDetails">
            {/* <GroupStack.Screen name="Groups" component={GroupsScreen} /> */}
            <GroupStack.Screen name="GroupDetails" component={GroupDetailsScreen} />
            <GroupStack.Screen name="AddExpense" component={AddExpenseScreen} />
        </GroupStack.Navigator>
    );
}
