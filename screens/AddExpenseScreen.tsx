import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addExpense, fetchGroupMembers } from "../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

export default function AddExpenseScreen({ route, navigation } : any) {
    const { groupId, token } = route.params;
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [members, setMembers] = useState<{ user_id: number; user_name: string }[]>([]);
    const [selectedPaidBy, setSelectedPaidBy] = useState<number | null>(null);

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

            console.log(selectedPaidBy);
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Add Expense</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Paid By</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedPaidBy}
                    onValueChange={(itemValue) => setSelectedPaidBy(itemValue)}
                    style={styles.picker}
                >
                    {members.map((member) => (
                        <Picker.Item key={member.user_id} label={member.user_name} value={member.user_id} />
                    ))}
                </Picker>
            </View>
            <Button title="Add Expense" onPress={handleAddExpense} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    input: { borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 16 },
    label: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 16 },
    picker: { height: 70, width: "100%" },
});