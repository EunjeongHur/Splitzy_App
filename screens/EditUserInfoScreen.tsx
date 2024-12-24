import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { updateUserInformation } from "../services/apiService";
import colors from "../utils/colors";
import { useAuth } from "../src/context/AuthContext";
import { handleAuthError } from "../utils/authUtils";

export default function EditUserInfoScreen({ route, navigation }: any) {
    const { token, userInfo } = route.params;
    const [firstName, setFirstName] = useState<string>(userInfo.firstName || "");
    const [lastName, setLastName] = useState<string>(userInfo.lastName || "");
    const [email, setEmail] = useState<string>(userInfo.email || "");
    const [username, setUsername] = useState<string>(userInfo.username || "");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { setToken } = useAuth();


    const handleSave = async () => {
        if (!firstName || !lastName || !email || !username) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        try {
            const updatedInfo = { firstName, lastName, email, username };
            await updateUserInformation(token, updatedInfo);
            Alert.alert("Success", "Your information has been updated successfully!");
            navigation.navigate("UserInfo", { refresh: true });
        } catch (error: any) {
            if (!handleAuthError(error, setToken)) {
                console.error("Failed to update user info:", error);
                Alert.alert("Error", "Could not update your information. Please try again.");
            }
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
                        Edit Information
                    </Text>
                    <TextInput
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <TextInput
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
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
                    {/* <TextInput
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
                    /> */}
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={styles.button}
                        theme={{
                            colors: {
                                primary: colors.primary,
                                onPrimary: colors.secondary,
                            },
                        }}
                    >
                        Save
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
