import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";

const AuthStack = createNativeStackNavigator();

const AuthNavigator = ({ onLogin }: { onLogin: () => void }) => {
    return (
        <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} onLogin={onLogin} />}
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
