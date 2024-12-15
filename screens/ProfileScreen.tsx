import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../App";

// type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen({ navigation }: { navigation: any }) {
    // const navigation = useNavigation<RootNavigationProp>();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            Alert.alert("Logged Out", "You have been logged out successfully.");

            // Navigate to the login screen
            navigation.navigate("Auth", { screen: "Login" });
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
        <View style={styles.container}>
            <Text style={styles.title}>Profile Screen</Text>
            <Button title="Logout" onPress={confirmLogout} />
        </View>
    );
}



const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
