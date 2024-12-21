import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from "react-native";
import { searchUsers, sendGroupInvitation } from "../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Text, TextInput, Button, Searchbar, ActivityIndicator, List, Chip } from "react-native-paper";
import { useAuth } from "../src/context/AuthContext";
import colors from "../utils/colors";

export default function CreateGroupScreen({ route, navigation }: any) {
    const { groupName } = route.params;
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { token } = useAuth();

    const handleSearch = async () => {
        setLoading(true);
        if (!token || !searchQuery) {
            console.error("Token is null");
            return;
        }
        try {
            const results = await searchUsers(token, searchQuery);
            const filteredResults = results.filter(
                (result: any) => !selectedUsers.some((user) => user.id === result.id)
            );
            setSearchResults(filteredResults);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = (user: any) => {
        setSelectedUsers([...selectedUsers, user]);
        setSearchResults(searchResults.filter((u) => u.id !== user.id));
    };

    const handleRemoveUser = (userId: number) => {
        const updatedSelectedUsers = selectedUsers.filter((user) => user.id !== userId);
        setSelectedUsers(updatedSelectedUsers);
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length === 0 || !token) {
            Alert.alert("Error", "Please enter a group name and select at least one member.");
            return;
        }

        try {
            await sendGroupInvitation(token, groupName, selectedUsers.map((user) => user.id));
            navigation.navigate("GroupLists")
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* App Bar Section */}
            <Appbar.Header style={{ backgroundColor: colors.white }}>
                <View style={styles.iconBackgroundContainer}>
                    <Appbar.BackAction color={colors.black} onPress={() => navigation.goBack()} />
                </View>
            </Appbar.Header>

            {/* Main Content Section */}
            <View style={styles.MainContainer}>
                <Text variant="headlineMedium" style={styles.title}>
                    Invite members
                </Text>
                <Searchbar
                    placeholder="Search by name or username"
                    onChangeText={(query) => setSearchQuery(query)}
                    value={searchQuery}
                    onIconPress={handleSearch}
                    onSubmitEditing={handleSearch}
                    style={styles.searchBar}
                    theme={{
                        colors: {
                            primary: colors.gray,
                            surface: colors.white,
                        }
                    }}
                />
                <View style={styles.selectedUsersContainer}>
                    <View style={styles.chipContainer}>
                        {selectedUsers.map((user) => (
                            <Chip
                                key={user.id}
                                mode="outlined"
                                style={styles.chip}
                                onClose={() => handleRemoveUser(user.id)}
                                textStyle={styles.chipText}
                                theme={{
                                    colors: {
                                        onSurfaceVariant: colors.secondary
                                    }
                                }}
                            >
                                {user.fname} {user.lname}
                            </Chip>
                        ))}
                    </View>
                </View>
            </View>

            {/* Search Results Section */}
            <View style={styles.resultsContainer}>
                {loading ? (
                    <ActivityIndicator animating={true} size="large" color={colors.primary} />
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <List.Item
                                key={item.id}
                                title={`${item.username} • ${item.fname} ${item.lname}`}
                                right={() => (
                                    <Button
                                        mode="contained"
                                        onPress={() => handleAddUser(item)}
                                        theme={{
                                            colors: {
                                                primary: colors.tertiary,
                                                onPrimary: colors.secondary,
                                            }
                                        }}
                                    >
                                        Invite
                                    </Button>
                                )}
                            />
                        )}
                    />
                )}

            </View>

            {/* Create Group Button */}
            <View style={styles.submitButtonContainer}>
                <Button
                    mode="contained"
                    onPress={handleCreateGroup}
                    disabled={selectedUsers.length === 0}
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    iconBackgroundContainer: {
        backgroundColor: colors.tertiary,
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    MainContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
    },
    groupNameInput: {
        marginBottom: 20,
    },
    searchBar: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    title: {
        fontWeight: "bold",
        marginLeft: 12,
        marginBottom: 16,
    },
    createGroupButton: {
        marginTop: 16,
    },
    inviteButton: {
        backgroundColor: colors.tertiary,
    },
    submitButtonContainer: {
        padding: 16,
        backgroundColor: colors.white,
    },
    selectedUsersContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    selectedUsersTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: colors.primary,
    },
    chipText: {
        color: colors.secondary,
    },
});
