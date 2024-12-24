import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import colors from "../utils/colors"

const LandingScreen = ({ navigation }: { navigation: any }) => {

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.taglineContainer}>
                    <Text
                        variant="displaySmall"
                        style={styles.tagline}
                    >
                        EFFORTLESS EXPENSE SHARING, SIMPLIFIED FOR EVERYONE
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate("Login")}
                        style={styles.button}
                        theme={{
                            colors: {
                                primary: colors.primary,
                                onPrimary: colors.secondary,
                            }
                        }}
                    >
                        Log in
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate("SignUp")}
                        style={styles.button}
                        theme={{
                            colors: {
                                primary: colors.primary,
                                onPrimary: colors.secondary,
                            }
                        }}
                    >
                        Sign up
                    </Button>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
    },
    mainContainer: {
        flex: 0.7,
        justifyContent: "space-around"
    },
    taglineContainer: {
        flex: 0.8,
        justifyContent: "center",
    },
    tagline: {
        textAlign: "center",
        fontWeight: "bold"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    button: {
        flex: 0.48,
        margin: 5,
        backgroundColor: colors.primary,
    },
});

export default LandingScreen;
