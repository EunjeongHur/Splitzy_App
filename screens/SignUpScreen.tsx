import React, { useState } from "react";
import { Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signUp } from "../services/apiService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

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
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={fname}
                onChangeText={setfName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lname}
                onChangeText={setlName}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Text
                style={styles.link}
                onPress={() => navigation.navigate("Login")}
            >
                Already have an account? Login
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
    link: { color: "#007BFF", marginTop: 16, textAlign: "center" },
});
