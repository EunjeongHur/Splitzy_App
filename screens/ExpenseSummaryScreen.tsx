import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList, Alert } from "react-native";
import { fetchSettlementDetails, fetchGroups, settleTransaction, undoTransaction } from "../services/apiService";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../src/context/AuthContext";
import { Text, Appbar, List, Button } from "react-native-paper";
import colors from "../utils/colors";
import { handleAuthError } from "../utils/authUtils";

export default function ExpenseSummaryScreen({ route, navigation }: any) {
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [settlements, setSettlements] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);
    const { token, setToken } = useAuth();

    // Load groups on screen focus
    useFocusEffect(
        useCallback(() => {
            const loadGroups = async () => {
                setLoading(true);
                try {
                    if (!token) {
                        console.error("Token is null");
                        return;
                    }
                    const groupList = await fetchGroups(token);
                    setGroups(groupList);

                    // Set the selectedGroupId from route params or default to the first group
                    if (route.params?.groupId) {
                        setSelectedGroupId(route.params.groupId);
                    } else if (groupList.length > 0) {
                        setSelectedGroupId(groupList[0].id);
                    }
                } catch (error: any) {
                    if (!handleAuthError(error, setToken)) {
                        console.error("Failed to load groups:", error);
                    }
                } finally {
                    setLoading(false);
                }
            };

            loadGroups();
        }, [route.params?.groupId, token])
    );

    // Load settlements whenever selectedGroupId changes
    useEffect(() => {
        const loadSettlements = async () => {
            if (!token) {
                setToken(null);
                return;
            }
            if (!selectedGroupId) return;

            setLoading(true);
            try {
                const settlementData = await fetchSettlementDetails(selectedGroupId, token);
                setSettlements(settlementData.settlements);
            } catch (error: any) {
                if (!handleAuthError(error, setToken)) {
                    console.error("Failed to fetch settlements:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        loadSettlements();
    }, [selectedGroupId, token]);

    const handleSettleItem = async (settlementId: number, isSettled: boolean) => {
        try {
            if (!token) {
                console.error("Token is null");
                return;
            }

            if (isSettled) {
                await undoTransaction(settlementId, token);
            } else {
                await settleTransaction(settlementId, token);
            }

            setSettlements((prevSettlements) =>
                prevSettlements.map((s) =>
                    s.id === settlementId ? { ...s, is_settled: isSettled ? 0 : 1 } : s
                )
            );
        } catch (error: any) {
            if (!handleAuthError(error, setToken)) {
                console.error("Failed to process transaction:", error);
                Alert.alert("Error", "Could not update the transaction.");
            }
        }
    };

    const renderSettlementItem = ({ item }: any) => (
        <View style={styles.settlementItem}>
            <Text style={item.is_settled ? styles.settledText : null}>
                {item.from_user_name} → {item.to_user_name}: ${item.amount}
            </Text>
            <Button
                mode="contained"
                onPress={() => handleSettleItem(item.id, item.is_settled)}
                theme={item.is_settled ? {
                    colors: {
                        primary: colors.white,
                        onPrimary: colors.secondary
                    }
                } : {
                    colors: {
                        primary: colors.primary,
                        onPrimary: colors.secondary,
                    }
                }}
                style={item.is_settled ? styles.undoButton : null}
            >{item.is_settled ? "Undo" : "Settle"}
            </Button>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* App Bar Section */}
            <Appbar.Header style={styles.AppBarHeader}>
                <Appbar.Content title="Expense Summary" />
            </Appbar.Header>

            {/* Main Content */}
            <View style={styles.MainContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.secondary} />
                ) : groups.length === 0 ? (
                    <View style={styles.noGroupContainer}>
                        <Text
                            variant="displayMedium"
                            style={styles.noSettlementEmpText}
                        >
                            Oops!
                        </Text>
                        <Text
                            variant="headlineMedium"
                            style={styles.noGroupText}
                        >
                            {"\nNo groups available\nPlease create a group to get started!\n"}
                        </Text>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate("Home", { screen: "CreateGroup" })}
                            style={styles.createGroupButton}
                            theme={{
                                colors: {
                                    primary: colors.primary,
                                    onPrimary: colors.secondary,
                                }
                            }}
                        >
                            Create Group
                        </Button>
                    </View>
                ) : (
                    <>
                        {/* Group Selector */}
                        <List.Accordion
                            theme={{ colors: { primary: colors.black } }}
                            title={
                                selectedGroupId
                                    ? groups.find((group) => group.id === selectedGroupId)?.name || "Select a Group"
                                    : "Select a Group"
                            }
                            expanded={accordionExpanded}
                            onPress={() => setAccordionExpanded(!accordionExpanded)}
                            left={(props) => <List.Icon {...props} icon="account-multiple" />}
                            style={styles.accordion}
                        >
                            {groups.map((group) => (
                                <List.Item
                                    key={group.id}
                                    title={group.name}
                                    onPress={() => {
                                        setSelectedGroupId(group.id);
                                        setAccordionExpanded(false);
                                    }}
                                    style={[
                                        styles.accordionItem,
                                        selectedGroupId === group.id && styles.selectedAccordionItem,
                                    ]}
                                />
                            ))}
                        </List.Accordion>

                        {/* Settlement List */}
                        {settlements.length === 0 ? (
                            <View style={styles.noSettlementContainer}>
                                <Text
                                    variant="displayMedium"
                                    style={styles.noSettlementEmpText}
                                >
                                    Oops!
                                </Text>
                                <Text
                                    variant="headlineMedium"
                                    style={styles.noSettlementText}
                                >
                                    {"\nNo settlement details available here\nTap the button to add new expense!\n"}
                                </Text>
                                <Button
                                    mode="contained"
                                    onPress={() => navigation.navigate("Home", {
                                        screen: "AddExpense",
                                        params: {
                                            selectedGroupId,
                                            token,
                                        }
                                    })}
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
                        ) : (
                            <FlatList
                                data={settlements}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderSettlementItem}
                            />
                        )}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    AppBarHeader: {
        backgroundColor: colors.white,
        justifyContent: "space-between",
        elevation: 5,
    },
    MainContainer: {
        padding: 16,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    },
    accordion: {
        backgroundColor: colors.white,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray
    },
    accordionItem: {
        backgroundColor: colors.white,
    },
    selectedAccordionItem: {
        backgroundColor: colors.tertiary,
    },
    createGroupButton: {
        marginTop: 16,
        backgroundColor: colors.primary,
    },
    addExpenseButton: {
        marginTop: 16,
        backgroundColor: colors.primary,
    },
    undoButton: {
        borderWidth: 1,
        borderColor: colors.secondary,
    },
    label: { fontSize: 16, marginBottom: 8 },
    groupItem: {
        marginRight: 10,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    settlementItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    noSettlementContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    settledText: { textDecorationLine: "line-through", color: "gray" },
    noSettlementEmpText: {
        fontWeight: "bold",
        textAlign: "center",
        color: colors.secondary,
    },
    noSettlementText: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "bold",
        textAlign: "center"
    },
    noGroupContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noGroupText: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "bold",
        textAlign: "center",
    },

});
