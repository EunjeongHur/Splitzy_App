import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <TabNavigator onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <AuthNavigator onLogin={() => setIsAuthenticated(true)} />
      )}
    </NavigationContainer>
  );
}
