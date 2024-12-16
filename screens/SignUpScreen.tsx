import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signUp } from "../services/apiService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function SignUpScreen({ navigation }: NativeStackScreenProps<any, "SignUp">) {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignUp = async () => {
        try {
            const response = await signUp(name, email, password);
            Alert.alert("Success", response.message);
            navigation.navigate("Login"); // 회원가입 후 로그인 화면으로 이동
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
                placeholder="Name"
                value={name}
                onChangeText={setName}
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
