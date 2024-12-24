import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { signUp } from "../services/apiService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../utils/colors";

export default function SignUpScreen({ navigation }: NativeStackScreenProps<any, "SignUp">) {
    const [fname, setfName] = useState<string>("");
    const [lname, setlName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSignUp = async () => {
        try {
            const response = await signUp(fname, lname, username, email, password);
            navigation.navigate("Login");
        } catch (error: any) {
            console.error("Signup failed:", error.message);
            Alert.alert("Error", error.response?.data?.error || "Failed to sign up.");
        }
    };

    return (
        <View style={styles.container}>
            {/* App Bar Section */}
            <Appbar.Header style={styles.AppBarHeader}>
                <View style={styles.iconBackgroundContainer}>
                    <Appbar.BackAction color={colors.black} onPress={() => navigation.goBack()} />
                </View>
            </Appbar.Header>

            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Sign up
                    </Text>
                    <TextInput
                        label="First Name"
                        value={fname}
                        onChangeText={setfName}
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <TextInput
                        label="Last Name"
                        value={lname}
                        onChangeText={setlName}
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
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
                        onPress={handleSignUp}
                        style={styles.button}
                        theme={{
                            colors: {
                                primary: colors.primary,
                                onPrimary: colors.secondary,
                            },
                        }}
                    >
                        Sign Up
                    </Button>
                </View>
            </View>
        </View>
    );
}

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
