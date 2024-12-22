// import React, { useState, useCallback, useEffect } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, FlatList } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import { Picker } from "@react-native-picker/picker";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { fetchSettlementDetails, fetchGroups, settleTransaction, undoTransaction } from "../services/apiService";
// import { useAuth } from "../src/context/AuthContext";


// export default function ExpenseSummaryScreen({ route, navigation }: any) {
//     const [groups, setGroups] = useState<any[]>([]);
//     const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
//     const [settlements, setSettlements] = useState<any[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const { token } = useAuth();

//     const loadGroups = async () => {
//         try {
//             if (token) {
//                 const groupList = await fetchGroups(token);
//                 setGroups(groupList);
//                 if (groupList.length > 0) setSelectedGroupId(groupList[0].id);
//             } else {
//                 console.error("Token is null");
//             }
//         } catch (error) {
//             console.error("Failed to load groups:", error);
//         } 
//     };

//     const loadSettlements = async () => {
//         if (!selectedGroupId || !token) return;

//         setLoading(true);
//         try {
//             const settlementData = await fetchSettlementDetails(selectedGroupId, token);
//             setSettlements(settlementData.settlements);
//         } catch (error) {
//             console.error("Failed to fetch settlements:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useFocusEffect(
//         useCallback(() => {
//             loadGroups();
//         }, [])
//     );

//     useEffect(() => {
//         loadSettlements();
//     }, [selectedGroupId]);

//     const handleSettleItem = async (settlementId: number, isSettled: boolean) => {
//         try {
//             if (!token) {
//                 console.error("Token is null");
//                 return;
//             }
    
//             if (isSettled) {
//                 // Undo settle
//                 await undoTransaction(settlementId, token);
//                 Alert.alert("Success", "Transaction marked as unsettled!");
//             } else {
//                 // Settle
//                 await settleTransaction(settlementId, token);
//                 Alert.alert("Success", "Transaction marked as settled!");
//             }
    
//             setSettlements((prevSettlements) =>
//                 prevSettlements.map((s) =>
//                     s.id === settlementId ? { ...s, is_settled: isSettled ? 0 : 1 } : s
//                 )
//             );
//         } catch (error) {
//             console.error("Failed to process transaction:", error);
//             Alert.alert("Error", "Could not update the transaction.");
//         }
//     };

//     const renderSettlementItem = ({ item }: any) => (
//         <View style={styles.settlementItem}>
//             <Text style={item.is_settled ? styles.settledText : null}>
//                 {item.from_user_name} → {item.to_user_name}: ${item.amount}
//             </Text>
//             <Button
//                 title={item.is_settled ? "Undo" : "Settle"}
//                 onPress={() => handleSettleItem(item.id, item.is_settled)}
//             />
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.title}>Expense Summary</Text>

//             <View style={styles.pickerContainer}>
//                 <Text style={styles.label}>Select a Group:</Text>
//                 <Picker
//                     selectedValue={selectedGroupId}
//                     onValueChange={(itemValue) => setSelectedGroupId(itemValue)}
//                     style={styles.picker}
//                 >
//                     {groups.map((group) => (
//                         <Picker.Item key={group.id} label={group.name} value={group.id} />
//                     ))}
//                 </Picker>
//             </View>

//             {loading ? (
//                 <ActivityIndicator size="large" color="#0000ff" />
//             ) : settlements.length > 0 ? (
//                 <FlatList
//                     data={settlements}
//                     keyExtractor={(item) => item.id.toString()}
//                     renderItem={renderSettlementItem}
//                 />
//             ) : (
//                 <Text>No settlement details available.</Text>
//             )}
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16 },
//     title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
//     pickerContainer: { marginBottom: 20 },
//     label: { fontSize: 16, marginBottom: 8 },
//     picker: { height: 50, width: "100%" },
//     sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
//     settlementItem: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingTop: 8,
//         paddingBottom: 8,
//         borderBottomWidth: 1,
//         borderColor: "#ccc",
//     },
//     settledText: { textDecorationLine: "line-through", color: "gray" },
// });
import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, Button } from "react-native";
import { fetchSettlementDetails, fetchGroups, settleTransaction, undoTransaction } from "../services/apiService";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";

export default function ExpenseSummaryScreen({ route }: any) {
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [settlements, setSettlements] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { token } = useAuth();

    // Load groups on screen focus
    useFocusEffect(
        useCallback(() => {
            const loadGroups = async () => {
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
                } catch (error) {
                    console.error("Failed to load groups:", error);
                }
            };

            loadGroups();
        }, [route.params?.groupId, token])
    );

    // Load settlements whenever selectedGroupId changes
    useEffect(() => {
        const loadSettlements = async () => {
            if (!selectedGroupId || !token) return;

            setLoading(true);
            try {
                const settlementData = await fetchSettlementDetails(selectedGroupId, token);
                setSettlements(settlementData.settlements);
            } catch (error) {
                console.error("Failed to fetch settlements:", error);
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
                Alert.alert("Success", "Transaction marked as unsettled!");
            } else {
                await settleTransaction(settlementId, token);
                Alert.alert("Success", "Transaction marked as settled!");
            }

            setSettlements((prevSettlements) =>
                prevSettlements.map((s) =>
                    s.id === settlementId ? { ...s, is_settled: isSettled ? 0 : 1 } : s
                )
            );
        } catch (error) {
            console.error("Failed to process transaction:", error);
            Alert.alert("Error", "Could not update the transaction.");
        }
    };

    const renderSettlementItem = ({ item }: any) => (
        <View style={styles.settlementItem}>
            <Text style={item.is_settled ? styles.settledText : null}>
                {item.from_user_name} → {item.to_user_name}: ${item.amount}
            </Text>
            <Button
                title={item.is_settled ? "Undo" : "Settle"}
                onPress={() => handleSettleItem(item.id, item.is_settled)}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Expense Summary</Text>

            {/* Group Selector */}
            <View style={styles.groupSelector}>
                <Text style={styles.label}>Select a Group:</Text>
                <FlatList
                    horizontal
                    data={groups}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Text
                            onPress={() => setSelectedGroupId(item.id)}
                            style={[
                                styles.groupItem,
                                selectedGroupId === item.id && styles.selectedGroup,
                            ]}
                        >
                            {item.name}
                        </Text>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Settlement List */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : settlements.length > 0 ? (
                <FlatList
                    data={settlements}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSettlementItem}
                />
            ) : (
                <Text style={styles.noSettlementText}>No settlement details available.</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    groupSelector: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8 },
    groupItem: {
        marginRight: 10,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    selectedGroup: { backgroundColor: "#e0f7fa", borderColor: "#00acc1" },
    settlementItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    settledText: { textDecorationLine: "line-through", color: "gray" },
    noSettlementText: { textAlign: "center", marginTop: 20, color: "gray" },
});
