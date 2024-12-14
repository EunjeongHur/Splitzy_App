import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import api from "../utils/api";

export default function CreateGroupScreen() {
    const [name, setName] = useState("");

    const createGroup = async () => {
        try {
            // await api.post("/groups", { name });
            alert("Group Created!");
        } catch (error) {
            console.error("Failed to create group:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Group</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter group name"
                value={name}
                onChangeText={setName}
            />
            <Button title="Create" onPress={createGroup} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    input: { borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 16 },
});
