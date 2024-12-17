import React, { useCallback, useState } from "react";
import { Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchGroups, Group } from "../services/apiService";
import { useAuth } from "../src/context/AuthContext";

export default function HomeScreen({ navigation }: { navigation: any }) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { token, setToken } = useAuth();
    const loadGroups = async () => {
        try {
            if (token) {
                const data = await fetchGroups(token);
                setGroups(data);
            } else {
                console.error("Token is null");
                setToken(null);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadGroups();
        }, [])
    );

    //Render group card
    const renderGroup = ({ item }: { item: Group }) => (
        <TouchableOpacity 
            style={styles.groupCard} 
            onPress={() => navigation.navigate("GroupDetails", { groupId: item.id,  token: token})}
        >
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDetails}>Total: ${item.total}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Your Groups</Text>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGroup}
                ListEmptyComponent={<Text>No groups found. Create one!</Text>}
            />
            <Button title="Create New Group" onPress={() => navigation.navigate("CreateGroup")} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    groupCard: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    groupName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    groupDetails: {
        fontSize: 14,
        marginTop: 4,
    },
    unsettledText: {
        fontSize: 14,
        marginTop: 4,
        color: "red",
    },
});
