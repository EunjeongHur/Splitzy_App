import React from "react";
import { SafeAreaView, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../services/apiService";

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result) {
                await AsyncStorage.removeItem("token");
                Alert.alert("Logged Out", "You have been logged out successfully.");
                onLogout();
            }
        } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "Failed to log out. Please try again.");
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Profile Screen</Text>
            <Button title="Logout" onPress={confirmLogout} />
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
