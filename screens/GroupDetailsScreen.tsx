import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchGroupDetails } from "../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar } from 'react-native-paper';


export default function GroupDetailsScreen({ route, navigation }: any) {
    const { groupId, token } = route.params;
    const [groupDetails, setGroupDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getGroupDetails = async () => {
        try {
            const details = await fetchGroupDetails(groupId);
            setGroupDetails(details);
        } catch (error) {
            console.error("Failed to fetch group details:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getGroupDetails();
        }, [])
    );

    const renderExpense = ({ item }: any) => (
        <View style={styles.expenseItem}>
            <Text style={styles.expenseTitle}>{item.description}</Text>
            <Text>${item.amount}</Text>
            <Text>Paid by: {item.paid_by_name}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        
        <View>
            <Appbar.Header style={{backgroundColor: '#ffffff'}}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            {/* <Appbar.BackAction onPress={() => {}} /> */}
            </Appbar.Header>
            <Text style={styles.title}>{groupDetails?.name}</Text>
            <Text style={styles.subtitle}>Total Expense: ${groupDetails?.total}</Text>
            <Button
                title="Add Expense"
                onPress={() => navigation.navigate("AddExpense", { groupId, token })}
            />
            <Text style={styles.sectionTitle}>Expenses</Text>
            <FlatList
                data={groupDetails?.expenses}
                keyExtractor={(item) => item.expense_id.toString()}
                renderItem={renderExpense}
                ListEmptyComponent={<Text>No expenses added yet.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
    subtitle: { fontSize: 18, marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
    expenseItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 8,
    },
    expenseTitle: { fontSize: 16, fontWeight: "bold" },
    settlementItem: { padding: 8, borderBottomWidth: 1, borderColor: "#ccc" },
});
