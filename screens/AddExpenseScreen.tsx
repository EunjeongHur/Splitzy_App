import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, FlatList } from "react-native";
import { addExpense, fetchGroupMembers } from "../services/apiService";
import { Appbar, Text, TextInput, Button, ActivityIndicator, Card, Menu, IconButton, List } from "react-native-paper";
import colors from "../utils/colors";

export default function AddExpenseScreen({ route, navigation }: any) {
    const { groupId, token } = route.params;
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [members, setMembers] = useState<{ user_id: number; user_name: string }[]>([]);
    const [selectedPaidBy, setSelectedPaidBy] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const loadMembers = async () => {
            try {
                const membersData = await fetchGroupMembers(groupId);
                setMembers(membersData);
                if (membersData.length > 0) {
                    setSelectedPaidBy(membersData[0].user_id);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
                Alert.alert("Error", "Failed to load group members");
            } finally {
                setLoading(false);
            }
        };

        loadMembers();
    }, [groupId]);

    const handleAddExpense = async () => {
        try {
            if (!description || !amount || !selectedPaidBy) {
                Alert.alert("Validation Error", "Please fill in all fields");
                return;
            }

            const response = await addExpense(groupId, token, parseFloat(amount), description, selectedPaidBy);

            if (response.success) {
                Alert.alert("Success", "Expense added successfully!");
                navigation.goBack();
            } else {
                Alert.alert("Error", "Failed to add expense");
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            Alert.alert("Error", "An error occurred while adding the expense");
        }
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
            <Appbar.Header style={{ backgroundColor: colors.white }}>
                <View style={styles.iconBackgroundContainer}>
                    <Appbar.BackAction color={colors.black} onPress={() => navigation.goBack()} />
                </View>
            </Appbar.Header>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Add Expense
                    </Text>
                    <TextInput
                        label="Description"
                        mode="outlined"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <TextInput
                        label="Amount"
                        mode="outlined"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        style={styles.input}
                        theme={{ colors: { primary: colors.black } }}
                    />
                    <Text
                        variant="labelLarge"
                        style={styles.label}
                    >
                        Paid By
                    </Text>
                    <List.Accordion
                        theme={{ colors: { primary: colors.black } }}
                        title={
                            members.find((member) => member.user_id === selectedPaidBy)?.user_name ||
                            "Select Member"
                        }
                        expanded={expanded}
                        onPress={() => setExpanded(!expanded)}
                        style={styles.accordion}
                    >
                        <View style={styles.listContainer}>
                            <FlatList
                                data={members}
                                keyExtractor={(item) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <List.Item
                                        title={item.user_name}
                                        onPress={() => {
                                            setSelectedPaidBy(item.user_id);
                                            setExpanded(false);
                                        }}
                                        style={
                                            selectedPaidBy === item.user_id
                                                ? styles.selectedItem
                                                : styles.unselectedItem
                                        }
                                    />
                                )}
                            />
                        </View>
                    </List.Accordion>
                </View>
                <View style={styles.addButtonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleAddExpense}
                        disabled={!description.trim() || !amount.trim() || !selectedPaidBy}
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    iconBackgroundContainer: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
        flex: 1,
    },
    cardContent: {
        flex: 4,
        justifyContent: "flex-start",
    },
    title: {
        marginBottom: 16,
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        marginBottom: 16,
        backgroundColor: "#ffffff",
    },
    label: {
        fontWeight: "bold",
        marginLeft: 5,
    },
    accordion: {
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#282a35",
        backgroundColor: colors.white,
    },
    selectedItem: {
        backgroundColor: colors.tertiary,
    },
    unselectedItem: {
        backgroundColor: "#ffffff",
    },
    addButton: {
        marginTop: 16,
        backgroundColor: "#282a35",
    },
    addButtonContent: {
        paddingVertical: 5,
    },
    listContainer: {
        maxHeight: 250,
        backgroundColor: "#0077b6",
    },
    addButtonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 5,
        backgroundColor: colors.white,
    },
});