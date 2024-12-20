import React, { useState, useCallback } from "react";
import { View,  FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchGroupDetails } from "../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Card, Text, Button } from 'react-native-paper';


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
        <Card style={styles.expenseCard}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.expenseTitle}>
                    {item.description}
                </Text>
                <Text>Amount: ${item.amount}</Text>
                <Text>Paid by: {item.paid_by_name}</Text>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator animating={true} size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: "#ffffff" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Group Details" />
            </Appbar.Header>
            <View style={styles.content}>
                <Card style={styles.groupInfoCard}>
                    <Card.Content>
                        <Text variant="headlineMedium" style={styles.title}>
                            {groupDetails?.name}
                        </Text>
                        <Text variant="bodyLarge" style={styles.subtitle}>
                            Total Expense: ${groupDetails?.total}
                        </Text>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate("AddExpense", { groupId, token })}
                            style={styles.addExpenseButton}
                        >
                            Add Expense
                        </Button>
                    </Card.Content>
                </Card>

                <Text variant="titleLarge" style={styles.sectionTitle}>
                    Expenses
                </Text>

                <FlatList
                    data={groupDetails?.expenses}
                    keyExtractor={(item) => item.expense_id.toString()}
                    renderItem={renderExpense}
                    ListEmptyComponent={<Text>No expenses added yet.</Text>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    groupInfoCard: {
        marginBottom: 16,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    subtitle: {
        marginBottom: 16,
        color: "#555",
    },
    addExpenseButton: {
        marginTop: 16,
        backgroundColor: "#0077b6",
    },
    sectionTitle: {
        fontWeight: "bold",
        marginVertical: 16,
        color: "#333",
    },
    expenseCard: {
        marginVertical: 8,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        elevation: 2,
    },
    expenseTitle: {
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
});