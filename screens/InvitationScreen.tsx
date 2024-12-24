import React, { useCallback, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchInvitations, acceptInvitation, declineInvitation } from "../services/apiService";
import { handleAuthError } from "../utils/authUtils";
import { useAuth } from "../src/context/AuthContext";
import { Text, Card, Button, ActivityIndicator, Divider, Appbar } from "react-native-paper";
import colors from "../utils/colors"
import { useNavigation } from "@react-navigation/native";

const InvitationScreen = ({ updateBadge }: { updateBadge: (count: number) => void }) => {
    const navigation = useNavigation();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { token, setToken } = useAuth();

    const loadInvitations = async () => {
        try {
            if (token) {
                const data = await fetchInvitations(token);
                setInvitations(data);
                updateBadge(data.length);
            } else {
                console.error("Token is null");
                setToken(null);
            }
        } catch (error: any) {
            if (!handleAuthError(error, setToken)) {
                console.error("Failed to fetch invitations:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadInvitations();
        }, [])
    );

    const handleAccept = async (invitationId: number, groupId: number) => {
        try {
            if (token) {
                await acceptInvitation(invitationId, groupId, token);
                setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
                alert("You have accepted the invitation!");
                const parentNavigator = navigation.getParent();
                if (parentNavigator) {
                    parentNavigator.setParams({ refresh: true });
                }
                loadInvitations();
            } else {
                console.error("Token is null");
            }
        } catch (error: any) {
            if (!handleAuthError(error, setToken)) {
                console.error("Failed to accept invitation:", error);
                alert("Could not accept the invitation.");
            }
        }
    };

    const handleDecline = async (invitationId: number) => {
        try {
            if (token) {
                await declineInvitation(invitationId, token);
                setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
                const parentNavigator = navigation.getParent();
                if (parentNavigator) {
                    parentNavigator.setParams({ refresh: true });
                }
                alert("You have declined the invitation.");
                loadInvitations();
            } else {
                console.error("Token is null");
            }
        } catch (error: any) {
            if (!handleAuthError(error, setToken)) {
                console.error("Failed to decline invitation:", error);
                alert("Could not decline the invitation.");
            }
        }
    };

    const renderInvitationItem = ({ item }: any) => (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleLarge" style={styles.invitationText}>
                    {item.group_name}
                </Text>
                <Text variant="bodyMedium" style={styles.invitationText2}>
                    Invited by {item.inviter_name}
                </Text>
                <Divider style={{ marginVertical: 8 }} />
                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => handleDecline(item.invitation_id)}
                        style={styles.declineButton}
                        theme={{
                            colors: {
                                primary: colors.danger,

                            }
                        }}
                    >
                        Decline
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => handleAccept(item.invitation_id, item.group_id)}
                        theme={{
                            colors: {
                                primary: colors.primary,
                            }
                        }}
                        textColor={colors.secondary}
                        style={styles.acceptButton}
                    >
                        Accept
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            {/* App Bar Section */}
            <Appbar.Header style={styles.AppBarHeader}>
                <Appbar.Content title="Invitations" />
            </Appbar.Header>
            <View style={styles.mainContainer}>
                {loading ? (
                    <ActivityIndicator animating={true} size="large" color="#6200ee" />
                ) : invitations && invitations.length > 0 ? (
                    <FlatList
                        data={invitations}
                        keyExtractor={(item) => item.invitation_id.toString()}
                        renderItem={renderInvitationItem}
                    />
                ) : (
                    <View style={styles.noInvitationsContainer}>
                        <Text
                            variant="displayMedium"
                            style={styles.noInvitationsEmpText}
                        >
                            Oops!
                        </Text>
                        <Text
                            variant="headlineMedium"
                            style={styles.noInvitationsText}
                        >
                            {"\nYou're all caught up!\nNo invitations at the moment."}
                        </Text>

                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    mainContainer: {
        flex: 1,
        padding: 16,
    },
    AppBarHeader: {
        backgroundColor: colors.white,
        justifyContent: "space-between",
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: colors.tertiary,
        elevation: 1,
    },
    invitationText: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    invitationText2: {
        color: "#757575",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    acceptButton: {
        flex: 0.48,
    },
    declineButton: {
        flex: 0.48,
        borderColor: colors.danger,
        backgroundColor: colors.white,
    },
    noInvitationsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noInvitationsEmpText: {
        fontWeight: "bold",
        textAlign: "center",
        color: colors.secondary,
    },
    noInvitationsText: {
        textAlign: "center",
        color: colors.black,
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default InvitationScreen;
