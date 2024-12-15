import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchGroups, Group, testing } from "../services/apiService";

// Mock 데이터
const groups = [
    { id: "1", name: "Trip to Hawaii", total: 500, unsettled: 100 },
    { id: "2", name: "Roommates Expenses", total: 200, unsettled: 0 },
];

export default function HomeScreen() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // fetch groups from API
    useEffect(() => {
        const loadGroups = async () => {
            try {
                const data = await fetchGroups();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, []);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const data = await testing();

            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, []);

    //Render group card
    const renderGroup = ({ item }: { item: Group }) => (
        <TouchableOpacity style={styles.groupCard}>
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
            />
            <Button title="Create New Group" onPress={() => { }} />
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
