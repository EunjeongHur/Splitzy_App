import React, { useCallback, useState } from "react";
import { View, FlatList, StyleSheet, } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchGroups, Group } from "../services/apiService";
import { useAuth } from "../src/context/AuthContext";
import { ActivityIndicator, Text, Card, Appbar, Button } from "react-native-paper";
import colors from "../utils/colors";
import { handleAuthError } from "../utils/authUtils";

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
        } catch (error: any) {
            if (!handleAuthError(error, setToken)) {
                console.error("Error fetching groups: ", error.message);
            }
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
        <View style={styles.container}>
            <Appbar.Header style={styles.AppBarHeader}>
                <Appbar.Content title="Groups" />
                <Appbar.Action
                    icon='plus'
                    color={colors.secondary}
                    style={styles.createGroupButton}
                    onPress={() => navigation.navigate("CreateGroup")}
                />
            </Appbar.Header>
            <View style={styles.MainContainer}>
                {loading ? (
                    <ActivityIndicator animating={true} size="large" color={colors.secondary} />
                ) : groups && groups.length > 0 ? (
                    <FlatList
                        data={groups}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderGroup}
                    />
                ) : (
                    <View style={styles.noGroupContainer}>
                        <Text
                            variant="displayMedium"
                            style={styles.noGroupEmpText}
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
                            style={styles.createGroupButton2}
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
        flex: 1,
        padding: 16,
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
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    noGroupEmpText: {
        fontWeight: "bold",
        textAlign: "center",
        color: colors.secondary,
    },
    noGroupText: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "bold",
        textAlign: "center",
    },
    noGroupContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    createGroupButton2: {
        marginTop: 16,
        backgroundColor: colors.primary,
    }
});