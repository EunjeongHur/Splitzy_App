import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Text, Divider, List, IconButton } from "react-native-paper";
import { useAuth } from "../src/context/AuthContext"
import { fetchUserInformation } from "../services/apiService"
import colors from "../utils/colors"
import { handleAuthError } from "../utils/authUtils";

export default function ProfileScreen({ navigation, onLogout }: { navigation: any, onLogout: () => void }) {
    const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; email: string; username: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { token, setToken } = useAuth();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (token) {
                    const data = await fetchUserInformation(token);
                    setUserInfo(data);
                } else {
                    console.error('Token is null');
                    setToken(null);
                    return;
                }
            } catch (error: any) {
                if (!handleAuthError(error, setToken)) {
                    console.error("Failed to fetch user info:", error);
                }
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result) {
                await AsyncStorage.removeItem("token");
                onLogout();
            }
        } catch (error: any) {
            if (!handleAuthError(error, setToken)) {
                console.error("Logout failed:", error);
                Alert.alert("Error", "Failed to log out. Please try again.");
            }
        }
    };

    const confirmLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: handleLogout },
            ],
            { cancelable: true }
        );
    };

    if (!userInfo) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* User Avatar and Name Section */}
            <View style={styles.avatarContainer}>
                <Avatar.Text
                    size={100}
                    label={`${userInfo.firstName[0]}${userInfo.lastName[0]}`}
                    style={styles.avatarText}
                    color={colors.secondary}
                />
                <Text variant="headlineMedium" style={styles.userName}>
                    {userInfo.firstName.toUpperCase()} {userInfo.lastName.toUpperCase()}
                </Text>
            </View>

            {/* User Information Section */}
            <List.Section>
                <View style={styles.subheaderContainer}>
                    <List.Subheader style={styles.subHeader}>Personal Information</List.Subheader>
                    <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => navigation.navigate("Edit", { token, userInfo })}
                        style={styles.editIcon}
                    />
                </View>
                <List.Item
                    title="Email"
                    description={userInfo.email}
                    left={(props) => <List.Icon {...props} icon="email" />}
                />
                <Divider />
                <List.Item
                    title="Username"
                    description={userInfo.username}
                    left={(props) => <List.Icon {...props} icon="account" />}
                />
                <List.Subheader style={styles.subHeader}>Actions</List.Subheader>
                <List.Item
                    title="Close Account"
                    left={(props) => <List.Icon {...props} icon="close" />}
                    onPress={confirmLogout}
                />
                <Divider />
                <List.Item
                    title="Log out"
                    left={(props) => <List.Icon {...props} icon="logout" />}
                    onPress={confirmLogout}
                />
            </List.Section>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.white,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatarText: {
        backgroundColor: colors.tertiary,
        fontWeight: "bold",
    },
    userName: {
        marginTop: 10,
        fontWeight: "bold",
        color: colors.black,
    },
    subHeader: {
        fontWeight: "bold",
        fontSize: 20,
    },
    infoCard: {
        width: "100%",
        // padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2, // Add shadow for Android
    },
    infoText: {
        marginBottom: 10,
        color: colors.gray,
    },
    divider: {
        marginVertical: 10,
        backgroundColor: colors.gray,
    },
    editButton: {
        marginBottom: 16,
        borderRadius: 25,
        borderColor: colors.primary,
        width: "100%",
    },
    editButtonLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.primary,
    },

    logoutButton: {
        width: "100%",
        borderRadius: 25,
    },
    logoutButtonLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.white
    },
    editIcon: {
        marginRight: 8,
    },
    editInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 8,
        marginVertical: 8,
        width: "100%",
        backgroundColor: "#fff",
    },
    subheaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
