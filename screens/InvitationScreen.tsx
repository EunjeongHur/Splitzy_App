import React,  { useCallback, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchInvitations, acceptInvitation, declineInvitation } from "../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";

const InvitationScreen = () => {
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { token } = useAuth();

    const loadInvitations = async () => {
        try {
            if (token) {
                const data = await fetchInvitations(token);
                setInvitations(data);
            } else {
                console.error("Token is null");
            }
        } catch (error) {
            console.error("Failed to fetch invitations:", error);
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
                Alert.alert("Success", "You have accepted the invitation!");
                loadInvitations();
            } else {
                console.error("Token is null");
            }
        } catch (error) {
            console.error("Failed to accept invitation:", error);
            Alert.alert("Error", "Could not accept the invitation.");
        }
    };

    const handleDecline = async (invitationId: number) => {
        try {
            if (token) {
                await declineInvitation(invitationId, token);
                setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
                Alert.alert("Success", "You have declined the invitation.");
                loadInvitations();
            } else {
                console.error("Token is null");
            }
        } catch (error) {
            console.error("Failed to decline invitation:", error);
            Alert.alert("Error", "Could not decline the invitation.");
        }
    };

    const renderInvitationItem = ({ item }: any) => (
        <View style={styles.invitationItem}>
            <Text style={styles.invitationText}>
                {item.group_name}
            </Text>
            <Text style={styles.invitationText2}>
                - Invited by {item.inviter_name}
            </Text>
            <View style={styles.buttonContainer}>
                <Button title="Accept" onPress={() => handleAccept(item.invitation_id, item.group_id)} />
                <Button title="Decline" onPress={() => handleDecline(item.invitation_id)} color="red" />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Invitations</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : invitations.length > 0 ? (
                <FlatList
                    data={invitations}
                    keyExtractor={(item) => item.invitation_id.toString()}
                    renderItem={renderInvitationItem}
                />
            ) : (
                <Text>No invitations available.</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    invitationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 8,
    },
    invitationText: {
        fontSize: 16,
        marginBottom: 8,
    },
    invitationText2: {
        fontSize: 14,
        textAlign: "right",
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default InvitationScreen;
