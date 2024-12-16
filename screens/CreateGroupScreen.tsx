import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createGroup } from "../services/apiService";


export default function CreateGroupScreen() {
    const [groupName, setgroupName] = useState("");
    const [members, setMembers] = useState("");

    const handleCreateGroup = async () => {
        try {
            if (!groupName.trim()) {
                Alert.alert("Error", "Group name cannot be empty");
                return;
            }
            const memberIds = members
                .split(",")
                .map((id) => id.trim())
                .filter((id) => !isNaN(Number(id)))
                .map((id) => Number(id));

            if (memberIds.length === 0) {
                Alert.alert("Error", "Please provide at least one valid member ID");
                return;
            }

            const response = await createGroup(groupName, memberIds);
        } catch (error) {
            console.error("Failed to create group:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create a New Group</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setgroupName}
            />
            <Button title="Create" onPress={handleCreateGroup} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    input: { borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 16 },
});
