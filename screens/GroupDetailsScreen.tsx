import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GroupStackParamList } from "../navigation/GroupStackNagivator" // GroupStackParamList 가져오기

// 네비게이션 타입 정의
type GroupDetailsNavigationProp = NativeStackNavigationProp<GroupStackParamList, "GroupDetails">;

export default function GroupDetailsScreen() {
    const navigation = useNavigation<GroupDetailsNavigationProp>(); // 타입 지정된 네비게이션 사용

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
