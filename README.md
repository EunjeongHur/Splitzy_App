# 📱 Splitzy_App

Splitzy is a mobile application built with **React Native** to simplify group expense tracking and cost sharing. This repository contains the **front-end code** for the app, providing a user-friendly interface and seamless interaction with the backend API.

---

## 💡 Fun Fact

Did you know? The name **Splitzy** comes from combining **"Split"** and **"Easy"**, representing how the app makes splitting expenses easy for everyone!

---

## 🚀 Features

-   **Group Management**: Create and manage groups for shared expenses.
-   **Expense Tracking**: Add, view, and manage group expenses with a clean UI.
-   **Invitation Management**: Accept or decline group invitations.
-   **Profile Management**: Update user profiles and preferences.
-   **Badge Notifications**: Real-time badge updates for pending invitations.

---

## 🛠️ Tech Stack

### **Frontend**

-   **React Native**: Cross-platform development for iOS and Android.
-   **TypeScript**: Strongly typed JavaScript for better code reliability.
-   **Expo**: Simplifies development, testing, and deployment.
-   **React Navigation**: For stack and tab-based navigation.
-   **React Native Paper**: Polished UI components for consistent design.
-   **Context API**: For managing global state (e.g., authentication, invitations).

---

## 📂 Directory Structure

```
Splitzy_App/
├── assets/
├── navigation/ # App navigation configuration
│ ├── AuthNavigator.tsx
│ ├── GroupStackNavigator.tsx
│ ├── ProfileStackNavigator.tsx
│ ├── RootNavigator.tsx
│ └── TabNavigator.tsx
├── screens/ # App screens
│ ├── AddExpenseScreen.tsx
│ ├── CreateGroupScreen.tsx
│ ├── EditUserInfoScreen.tsx
│ ├── ExpenseSummaryScreen.tsx
│ ├── GroupDetailsScreen.tsx
│ ├── HomeScreen.tsx
│ ├── InvitationScreen.tsx
│ ├── LandingScreen.tsx
│ ├── LoginScreen.tsx
│ ├── ProfileScreen.tsx
│ ├── SelectMembersScreen.tsx
│ └── SignUpScreen.tsx
├── services/
│ └── apiService.ts # API calls for backend integration
├── src/ # App logic and context
│ └── context/
│   └── AuthContext.tsx # Authentication context for global state
├── utils/ # Utility files and helpers
│ ├── api.ts
│ ├── authUtils.ts # Authentication helper functions
│ └── colors.ts # Centralized color definitions for UI
├── .gitignore # Git ignore configuration
├── app.json # Expo app configuration
├── App.tsx # Main entry point of the application
├── babel.config.js # Babel configuration for Expo
├── index.ts # Application entry file
├── package.json # Project metadata and dependencies
├── package-lock.json # Locked dependency versions
├── README.md # Project documentation
└── tsconfig.json # TypeScript configuration
```

---

## 🔗 API Integration

For detailed API documentation, visit the [SPLITZY_WEB_API](https://github.com/EunjeongHur/Splitzy_web_api) repository.

---

## 📷 Screenshots

Screenshots will be added soon to showcase the app's key features and design.

---

> This README was proofread and refined with assistance from ChatGPT.
