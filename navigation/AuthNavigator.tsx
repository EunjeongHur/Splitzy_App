import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LandingScreen from "../screens/LandingScreen";

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Landing" options={{ headerShown: false }}>
                {(props) => <LandingScreen {...props} />}
            </AuthStack.Screen>
            <AuthStack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} />}
            </AuthStack.Screen>
            <AuthStack.Screen name="SignUp" options={{ headerShown: false }}>
                {(props) => <SignUpScreen {...props} />}
            </AuthStack.Screen>
        </AuthStack.Navigator>
    )
}

export default AuthNavigator;
// export default function AuthNavigator() {
//     return (
//         <AuthStack.Navigator initialRouteName="Login">
//             <AuthStack.Screen name="Login" component={LoginScreen} />
//             <AuthStack.Screen name="SignUp" component={SignUpScreen} />
//         </AuthStack.Navigator>
//     );
// }
