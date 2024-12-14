import React from "react";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";

// Mock 데이터
const groups = [
    { id: "1", name: "Trip to Hawaii", total: 500, unsettled: 100 },
    { id: "2", name: "Roommates Expenses", total: 200, unsettled: 0 },
];

export default function HomeScreen() {
    const renderGroup = ({ item }: { item: typeof groups[0] }) => (
        <TouchableOpacity style={styles.groupCard}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDetails}>Total: ${item.total}</Text>
            {item.unsettled > 0 && (
                <Text style={styles.unsettledText}>Unsettled: ${item.unsettled}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Groups</Text>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={renderGroup}
            />
            <Button title="Create New Group" onPress={() => { }} />
        </View>
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
