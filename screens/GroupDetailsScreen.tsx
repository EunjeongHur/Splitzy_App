import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchGroupDetails } from "../services/apiService";
import { Appbar, Text, Button, Divider } from 'react-native-paper';
import colors from "../utils/colors";
import { Platform } from "react-native";


export default function GroupDetailsScreen({ route, navigation }: any) {
    const { groupId, token } = route.params;
    const [groupDetails, setGroupDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

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


    const renderExpense = ({ item, index }: any) => {
        const isNewDay =
            index === 0 ||
            groupDetails.expenses[index - 1].date !== item.date;

        return (
            <View style={styles.expenseSection}>
                {isNewDay && (
                    <>
                        <Text style={styles.dateText}>{item.date}</Text>
                        <Divider style={{ backgroundColor: colors.black }} />
                    </>
                )}
                <View style={styles.expenseCard}>
                    <Text style={styles.paidBy}>{item.paid_by_name}</Text>
                    <Text style={styles.amount}>${item.amount}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator animating={true} size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* App bar section */}
            <Appbar.Header style={styles.AppBarHeader}>
                <Appbar.BackAction
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Action
                    icon={MORE_ICON}
                    onPress={() => console.log("More options")}
                />
            </Appbar.Header>

            {/* Group Info section */}
            <View style={styles.groupInfoSection}>
                <View style={styles.groupInfoCard}>
                    <Text variant="displaySmall" style={styles.title}>
                        ${groupDetails?.total}
                    </Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        {groupDetails?.name}
                    </Text>

                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate("AddExpense", { groupId, token })}
                        style={styles.addExpenseButton}
                        theme={{
                            colors: {
                                primary: colors.primary,
                                onPrimary: colors.secondary,
                            }
                        }}
                    >
                        Add Expense
                    </Button>

                </View>

                <View>
                    <Divider style={{ backgroundColor: colors.black }} />
                    <Text variant="bodySmall" style={styles.sectionTitle}>
                        Expenses
                    </Text>
                </View>
            </View>

            {/* Expenses section */}
            <View style={styles.listContainer}>
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
    AppBarHeader: {
        backgroundColor: colors.tertiary,
        justifyContent: "space-between",
    },
    groupInfoSection: {
        flex: 0.5,
        backgroundColor: colors.tertiary,
        paddingLeft: 5,
        paddingRight: 5,
        justifyContent: "space-between",
    },
    groupInfoCard: {
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        marginBottom: 4,
        color: colors.black,
    },
    subtitle: {
        marginBottom: 10,
        color: colors.black,
    },
    addExpenseButton: {
        marginTop: 16,
        backgroundColor: colors.primary,
    },
    sectionTitle: {
        textAlign: "center",
        textDecorationLine: "underline",
        fontWeight: "bold",
        marginVertical: 14,
        color: colors.secondary,
    },
    listContainer: {
        flex: 1,
    },
    dateText: {
        fontSize: 14,
        color: colors.gray,
        marginVertical: 8,
    },
    expenseCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    expenseSection: {
        marginHorizontal: 16,
        backgroundColor: colors.white,
    },
    paidBy: {
        fontSize: 18,
        color: colors.black,
    },
    amount: {
        fontWeight: "bold",
        fontSize: 18,
        color: colors.black,
    },
});