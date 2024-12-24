import React, { useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InvitationScreen from "../screens/InvitationScreen";
import GroupStackNavigator from "./GroupStackNagivator";
import ExpenseSummaryScreen from "../screens/ExpenseSummaryScreen";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { useAuth } from '../src/context/AuthContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../utils/colors";
import { View, StyleSheet } from "react-native";
import { Badge } from "react-native-paper";
import { fetchInvitationCount } from "../services/apiService";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { token, setToken } = useAuth();
    const [invitationCount, setInvitationCount] = useState<number>(0);

    const loadInvitationCount = useCallback(async () => {
        try {
            if (token) {
                const count = await fetchInvitationCount(token);
                setInvitationCount(count);
            } else {
                console.error("Token is null");
            }
        } catch (error) {
            console.error("Failed to fetch invitation count:", error);
        }
    }, [token]);

    useEffect(() => {
        loadInvitationCount();
    }, [loadInvitationCount]);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = "";
                    let isInvitationTab = false;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Summary") {
                        iconName = focused ? "list" : "list-outline";
                    } else if (route.name === "Invitation") {
                        iconName = focused ? "mail" : "mail-outline";
                        isInvitationTab = true;
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }
                    return (
                        <View style={styles.iconContainer}>
                            <Ionicons name={iconName} size={size} color={color} />
                            {isInvitationTab && invitationCount > 0 && (
                                <Badge style={styles.badge}>{invitationCount}</Badge>
                            )}
                        </View>
                    );
                },
                tabBarActiveTintColor: colors.black,
                tabBarInactiveTintColor: colors.gray,
                tabBarStyle: {
                    backgroundColor: colors.white,
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
            <Tab.Screen name="Invitation">
                {(props) => (
                    <InvitationScreen
                        {...props}
                        updateBadge={(count: number) => setInvitationCount(count)} // Badge 업데이트 함수 전달
                    />
                )}
            </Tab.Screen>
            <Tab.Screen name="Profile">
                {(props) => <ProfileStackNavigator {...props} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    iconContainer: {
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -10,
        backgroundColor: colors.danger,
        color: colors.white,
    },
});

export default TabNavigator;
