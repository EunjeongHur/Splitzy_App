import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { signUp } from "../services/apiService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function SignUpScreen({ navigation }: NativeStackScreenProps<any, "SignUp">) {
    const [fname, setfName] = useState<string>("");
    const [lname, setlName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignUp = async () => {
        try {
            const response = await signUp(fname, lname, username, email, password);
            Alert.alert("Success", response.message);
            navigation.navigate("Login");
        } catch (error: any) {
            console.error("Signup failed:", error.message);
            Alert.alert("Error", error.response?.data?.error || "Failed to sign up.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Title style={styles.title}>Sign Up</Title>
                <TextInput
                    label="First Name"
                    value={fname}
                    onChangeText={setfName}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Last Name"
                    value={lname}
                    onChangeText={setlName}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                />
                <Button
                    mode="contained"
                    onPress={handleSignUp}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Sign Up
                </Button>
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate("Login")}
                >
                    Already have an account? <Text style={styles.linkText}>Login</Text>
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
        padding: 16,
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
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
    },
    link: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#757575",
    },
    linkText: {
        color: "#6200ee",
        fontWeight: "bold",
    },
});
