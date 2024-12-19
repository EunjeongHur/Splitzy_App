import React, { useState } from "react";
import RootNavigator from './navigation/RootNavigator';
import { Provider as PaperProvider, DefaultTheme, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { AuthProvider } from './src/context/AuthContext';
import { useColorScheme } from "react-native";

export default function App() {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === "dark");

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = {
    ...MD3LightTheme,
  
    // Specify a custom property
    custom: 'property',
  
    // Specify a custom property in nested object
    colors: {
      ...MD3LightTheme.colors,
      brandPrimary: 'red',
      brandSecondary: 'red',
    },
  };

  // const theme = isDarkMode ? MD3DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
