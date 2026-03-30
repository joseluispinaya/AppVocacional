import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// CAMBIO 1: Importamos Ionicons en lugar de MaterialCommunityIcons
import { Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import HomeStack from './HomeStack';
import TestStack from './TestStack'
import HistorialStack from './HistorialStack'
import AccountStack from './AccountStack'

const Tab = createBottomTabNavigator();

export default function Navigation() {

    const screenOptions = (route, color) => {
        let iconName;

        switch (route.name) {
            case "home":
                iconName = "home"; 
                break;
            case "test-model":
                iconName = "school";
                break;
            case "historia":
                iconName = "newspaper";
                break;
            case "account":
                iconName = "person";
                break;
            default:
                iconName = "help-circle"; // Icono por defecto por seguridad
                break;
        }

        // CAMBIO 2: Usamos el componente de Expo
        return (
            <Ionicons
                name={iconName}
                size={24} // Aumenté un poco el tamaño a 24, suele verse mejor en Ionicons
                color={color}
            />
        );
    };

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                    tabBarActiveTintColor: "#442484",
                    tabBarInactiveTintColor: "#a17dc3",
                    headerShown: false // Oculta el header duplicado del Tab
                })}
            >
                <Tab.Screen
                    name="home"
                    component={HomeStack}
                    options={{ title: "Inicio" }}
                />
                <Tab.Screen
                    name="test-model"
                    component={TestStack}
                    options={{ title: "Test" }}
                />
                <Tab.Screen
                    name="historia"
                    component={HistorialStack}
                    options={{ title: "Historia" }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{ title: "Cuenta" }}
                />
            </Tab.Navigator>
            <Toast />
        </NavigationContainer>
    )
}