import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addExpense } from "../services/apiService";

export default function AddExpenseScreen({ route, navigation } : any) {
    const { groupId, token } = route.params; // Pass groupId and userId via route parameters
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    const handleAddExpense = async () => {
        try {
            if (!description || !amount) {
                Alert.alert("Validation Error", "Please fill in all fields");
                return;
            }

            const response = await addExpense(groupId, token, parseFloat(amount), description);

            if (response.success) {
                Alert.alert("Success", "Expense added successfully!");
                navigation.goBack(); // Go back to the previous screen
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
            <Button title="Add Expense" onPress={handleAddExpense} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    input: { borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 16 },
});
