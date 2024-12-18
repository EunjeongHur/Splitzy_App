import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import {  searchUsers, sendGroupInvitation} from "../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";


export default function CreateGroupScreen({ navigation }: { navigation: any }) {
    const [groupName, setgroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([])
    const { token } = useAuth();

    const handleSearch = async () => {
        if (!token || !searchQuery) {
            console.error("Token is null");
            return;
        }
        try {
            const results = await searchUsers(token, searchQuery);
            const filteredResults = results.filter(
                (result: any) => !selectedUsers.some((user) => user.id === result.id)
            );
            setSearchResults(filteredResults);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    const handleAddUser = (user: any) => {
        setSelectedUsers([...selectedUsers, user]);
        setSearchResults(searchResults.filter((u) => u.id !== user.id));
    };

    const handleRemoveUser = (userId: number) => {
        const updatedSelectedUsers = selectedUsers.filter((user) => user.id !== userId);
        setSelectedUsers(updatedSelectedUsers);
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length === 0 || !token) {
            Alert.alert("Error", "Please enter a group name and select at least one member.");
            return;
        }

        try {
            
            await sendGroupInvitation(token, groupName, selectedUsers.map((user) => user.id));
            alert("Group Created and Invitations Sent!");
            navigation.goBack();
        } catch (error) {
            console.error("Error creating group:", error);
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
            <Text style={styles.subtitle}>Select Members</Text>
            <TextInput
                placeholder="Search users by username or email"
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
            />
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => handleAddUser(item)}>
                        <Text>{item.username} • {item.fname} {item.lname}</Text>
                        <Button title="Add" onPress={() => handleAddUser(item)} />
                    </TouchableOpacity>
                )}
            />
            <Text style={styles.sectionTitle}>Selected Users</Text>
            {selectedUsers.map((user) => (
                <View key={user.id} style={styles.selectedUserItem}>
                    <Text>{user.username} • {user.fname} {user.lname}</Text>
                    <Button title="Remove" onPress={() => handleRemoveUser(user.id)} />
                </View>
            ))}
            <Button title="Create Group" onPress={handleCreateGroup} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    subtitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
    },

    userItem: { flexDirection: "row", justifyContent: "space-between", padding: 8 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
    selectedUserItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
});