import React, { useState } from "react";
import { Text, StyleSheet, Alert, Linking, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";
import { TextInput, Button, Card, Title, Paragraph, useTheme } from "react-native-paper";

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { setToken } = useAuth();
    const theme = useTheme();

    const handleLogin = async () => {
        try {
            const data = await login(email, password);
            setToken(data.token);
            await AsyncStorage.setItem("userId", data.user.id.toString());
            Alert.alert("Success", "Logged in successfully!");
        } catch (error: any) {
            console.error("Login failed:", error.message);
            Alert.alert("Error", error.response?.data?.error || "Invalid credentials.");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Title style={styles.title}>Login</Title>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                />
                <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Log In
                </Button>
                <Text
                    style={styles.signupText}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    card: {
        width: "90%",
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        textAlign: "center",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginVertical: 10,
        borderRadius: 5,
        padding: 5,
    },
    buttonText: {
        fontSize: 16,
    },
    signupText: {
        marginTop: 10,
        textAlign: "center",
        color: "#757575",
    },
    signupLink: {
        color: "#6200ee",
        fontWeight: "bold",
    },
});
export default LoginScreen;