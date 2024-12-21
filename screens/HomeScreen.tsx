import React, { useCallback, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchGroups, Group } from "../services/apiService";
import { useAuth } from "../src/context/AuthContext";
import { ActivityIndicator, Text, Button, Card, IconButton, FAB } from "react-native-paper";
import colors from "../utils/colors";

export default function HomeScreen({ navigation }: { navigation: any }) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { token, setToken } = useAuth();
    const loadGroups = async () => {
        try {
            if (token) {
                const data = await fetchGroups(token);
                setGroups(data);
            } else {
                console.error("Token is null");
                setToken(null);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadGroups();
        }, [])
    );

    //Render group card
    const renderGroup = ({ item }: { item: Group }) => (
        <Card
            style={styles.groupCard}
            onPress={() => navigation.navigate("GroupDetails", { groupId: item.id, token: token })}
        >
            <Card.Content>
                <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{item.name}</Text>
                </View>
                <Text style={styles.groupDetails}>Total: ${item.total}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="headlineMedium">
                    Your Groups
                </Text>
                <FAB
                    icon="plus"
                    color={colors.secondary}
                    style={styles.createGroupButton}
                    onPress={() => navigation.navigate("CreateGroup")}
                />
            </View>
            {loading ? (
                <ActivityIndicator animating={true} size="large" color={colors.secondary} />
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderGroup}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No groups found. Create one!
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fafafa", // Lighter background color
    },
    title: {
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    groupCard: {
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    groupHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    groupName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    groupDetails: {
        fontSize: 14,
        marginTop: 4,
        color: "#666",
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
    createGroupButton: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
});