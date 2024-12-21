import React, { useState } from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Appbar, Text, TextInput, Button } from "react-native-paper";
import colors from "../utils/colors";

export default function CreateGroupScreen({ navigation }: { navigation: any }) {
    const [groupName, setgroupName] = useState("");

    const handleContinue = async () => {
        if (!groupName) {
            return;
        }

        try {
            navigation.navigate("SelectMembers", { groupName: groupName });
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* App Bar Section */}
            <Appbar.Header style={{ backgroundColor: colors.white }}>
                <View style={styles.iconBackgroundContainer}>
                    <Appbar.BackAction color={colors.black} onPress={() => navigation.goBack()} />
                </View>
            </Appbar.Header>

            {/* Main Content Section */}
            <View style={styles.MainContainer}>
                <Text variant="headlineMedium" style={styles.title}>
                    Create a New Group
                </Text>
                <TextInput
                    label="Group Name"
                    mode="outlined"
                    value={groupName}
                    onChangeText={setgroupName}
                    theme={{ colors: { primary: colors.black } }}
                    style={styles.groupNameInput}
                />
            </View>

            {/* Continue Button */}
            <View style={styles.continueButtonContainer}>
                <Button
                    mode="contained"
                    onPress={handleContinue}
                    disabled={!groupName.trim()}
                    theme={{
                        colors: {
                            primary: colors.primary,
                            onPrimary: colors.secondary,
                        }
                    }}
                >
                    Continue
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    MainContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
    },
    groupNameInput: {
        marginBottom: 20,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 30,
    },
    continueButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: colors.white,
    },
});
