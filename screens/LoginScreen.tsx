import React, { useState } from "react";
import { StyleSheet, Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/apiService";
import { useAuth } from "../src/context/AuthContext";
import { TextInput, Button, Appbar, Text } from "react-native-paper";
import colors from "../utils/colors"

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { setToken } = useAuth();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleLogin = async () => {
        try {
            const data = await login(email, password);
            setToken(data.token);
            await AsyncStorage.setItem("userId", data.user.id.toString());
        } catch (error: any) {
            console.error("Login failed:", error.message);
            Alert.alert("Error", error.response?.data?.error || "Invalid credentials.");
        }
    };

    return (
        <View style={styles.container}>
            {/* App Bar Section */}
            <Appbar.Header style={styles.AppBarHeader}>
                <View style={styles.iconBackgroundContainer}>
                    <Appbar.BackAction color={colors.black} onPress={() => navigation.navigate("Landing")} />
                </View>
            </Appbar.Header>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Log in
                    </Text>
                    <TextInput
                        label="Email"
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <TextInput
                        label="Password"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                        secureTextEntry={!showPassword}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword((prev) => !prev)}
                            />
                        }
                    />
                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        theme={{
                            colors: {
                                primary: colors.primary,
                                onPrimary: colors.secondary,
                            },
                        }}
                    >
                        Log In
                    </Button>
                </View>
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    AppBarHeader: {
        backgroundColor: colors.white,
    },
    iconBackgroundContainer: {
        backgroundColor: colors.tertiary,
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    card: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
        flex: 1,
    },
    cardContent: {
        flex: 4,
        justifyContent: "flex-start",
    },
    title: {
        fontWeight: "bold",
        color: colors.black,
        marginBottom: 16,
        marginLeft: 5,
    },
    input: {
        marginBottom: 16,
        backgroundColor: colors.white,
    },
    button: {
        marginTop: 16,
        backgroundColor: colors.primary,
    },
});

export default LoginScreen;
