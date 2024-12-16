import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/apiService";

const LoginScreen = ({ navigation, onLogin }: { navigation: any; onLogin: () => void }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        try {
            const data = await login(email, password);
            await AsyncStorage.setItem("token", data.token);
            Alert.alert("Success", "Logged in successfully!");
            onLogin();
        } catch (error: any) {
            console.error("Login failed:", error.message);
            Alert.alert("Error", error.response?.data?.error || "Invalid credentials.");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <Button title="Login" onPress={handleLogin} />
            <Text
                style={styles.link}
                onPress={() => navigation.navigate('SignUp')}
            >
                Don't have an account? Sign up
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

export default LoginScreen;


// export default function LoginScreen({ navigation }: NativeStackScreenProps<any, "Login">) {
//     const [email, setEmail] = useState<string>("");
//     const [password, setPassword] = useState<string>("");

//     const handleLogin = async () => {
//         try {
//             const data = await login(email, password);
//             await AsyncStorage.setItem("token", data.token);
//             Alert.alert("Success", "Logged in successfully!");
//             // navigation.replace('Tabs', { screen: 'Home' });
//         } catch (error: any) {
//             console.error("Login failed:", error.message);
//             Alert.alert("Error", error.response?.data?.error || "Invalid credentials.");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Login</Text>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//             />
//             <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 secureTextEntry
//                 value={password}
//                 onChangeText={setPassword}
//             />
//             <Button title="Login" onPress={handleLogin} />
//             <Text
//                 style={styles.link}
//                 onPress={() => navigation.navigate("Auth", { screen: "SignUp" })}
//             >
//                 Don't have an account? Sign up
//             </Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16 },
//     title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
//     input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
//     link: { color: "#007BFF", marginTop: 16, textAlign: "center" },
// });
