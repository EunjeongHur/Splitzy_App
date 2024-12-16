import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function GroupDetailsScreen({ navigation }: { navigation: any }) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Group Details Screen</Text>
            <Button
                title="Add Expense"
                onPress={() => navigation.navigate("AddExpense")} // 타입 에러 해결
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
});
