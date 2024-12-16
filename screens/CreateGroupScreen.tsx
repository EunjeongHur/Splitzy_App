import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { createGroup, getFriends } from "../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CreateGroupScreen({ navigation }: { navigation: any }) {
    const [groupName, setgroupName] = useState("");
    const [friends, setFriends] = useState<{ friend_id: number; friend_name: string }[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try { 
                let userId = await AsyncStorage.getItem("userId");
                const response = await getFriends(Number(userId));
                if (response.data.success) {
                    setFriends(response.data.result);
                } else {
                    throw new Error(response.data.error);
                }
            } catch (error) {
                console.error("Failed to fetch friends:", error);
                Alert.alert("Error", "Failed to fetch friends. Please try again later.");
            }
        };

        fetchFriends();
    }, []);

    const handleSelectFriend = (friendId: number) => {
        setSelectedFriends((prev) =>
            prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
        );
    }

    const handleCreateGroup = async () => {
        try {
            if (!groupName.trim()) {
                Alert.alert("Error", "Group name cannot be empty");
                return;
            }

            if (selectedFriends.length === 0) {
                Alert.alert("Error", "Please select at least one member");
                return;
            }

            let userId = await AsyncStorage.getItem("userId");
            selectedFriends.push(Number(userId));

            const response = await createGroup(groupName, selectedFriends);
            
            if (response.success) {
                Alert.alert("Success", "Group created successfully!");
                setgroupName("");
                setSelectedFriends([]);
                navigation.navigate("Groups", { screen: "GroupLists" });
            } else {
                throw new Error(response.error);
            }
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
            <Text style={styles.subtitle}>Select Members</Text>
            <FlatList
                data={friends}
                keyExtractor={(item) => item.friend_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.friendItem,
                            selectedFriends.includes(item.friend_id) && styles.friendItemSelected,
                        ]}
                        onPress={() => handleSelectFriend(item.friend_id)}
                    >
                        <Text style={styles.friendName}>{item.friend_name}</Text>
                    </TouchableOpacity>
                )}
            />
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
    friendItem: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 8,
    },
    friendItemSelected: {
        backgroundColor: "#cce5ff",
        borderColor: "#007bff",
    },
    friendName: {
        fontSize: 16,
    },
});