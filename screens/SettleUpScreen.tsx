// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import { settleUp } from "../services/apiService";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function SettleUpScreen({ route }: any) {
//     const { groupId, token } = route.params;
//     const [settlements, setSettlements] = useState<any[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const fetchSettlements = async () => {
//             try {
//                 const result = await settleUp(groupId, token);
//                 setSettlements(result.transactions);
//             } catch (error) {
//                 console.error("Failed to fetch settlements:", error);
//                 Alert.alert("Error", "Failed to load settlements");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSettlements();
//     }, [groupId, token]);

//     const renderSettlement = ({ item }: any) => (
//         <View style={styles.settlementItem}>
//             <Text>{item.from} → {item.to}: ${item.amount}</Text>
//         </View>
//     );

//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.title}>Settlement Results</Text>
//             <FlatList
//                 data={settlements}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={renderSettlement}
//                 ListEmptyComponent={<Text>No settlements calculated yet.</Text>}
//             />
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16 },
//     title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
//     settlementItem: {
//         padding: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ccc",
//         marginBottom: 8,
//     },
// });
