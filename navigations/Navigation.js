import React, { useContext } from 'react';

// 1. IMPORTAMOS DarkTheme de React Navigation
import { NavigationContainer, DarkTheme } from "@react-navigation/native"; 

//import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// CAMBIO 1: Importamos Ionicons en lugar de MaterialCommunityIcons
import { Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';
import { ActivityIndicator, View } from 'react-native';

import HomeStack from './HomeStack';
import TestStack from './TestStack'
import PruebaStack from './PruebaStack'
import HistorialStack from './HistorialStack'
import AccountStack from './AccountStack'

import AuthStack from './AuthStack'; // Importamos el nuevo Stack de Login
import { AuthContext } from '../context/AuthContext'; // Importamos nuestro contexto

const Tab = createBottomTabNavigator();

// 2. CREAMOS NUESTRO TEMA OSCURO PERSONALIZADO
const MiTemaOscuro = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#050505', // Tu fondo oscuro profundo para evitar bordes blancos
    },
};

export default function Navigation() {

    // Consumimos el estado del usuario y de carga
    const { user, isLoading } = useContext(AuthContext);

    // Mientras revisa el AsyncStorage, mostramos un cargador (le ponemos fondo oscuro también)
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050505' }}>
                <ActivityIndicator size="large" color="#00e5ff" />
            </View>
        );
    }

    const screenOptions = (route, color) => {
        let iconName;

        switch (route.name) {
            case "home":
                iconName = "home";
                break;
            case "test-model":
                iconName = "school";
                break;
            case "prueba-model":
                iconName = "book";
                break;
            case "historia":
                iconName = "newspaper";
                break;
            case "account":
                iconName = "person";
                break;
            default:
                iconName = "help-circle";
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
        <NavigationContainer theme={MiTemaOscuro}>
            {/* CONDICIONAL MÁGICO: Si hay usuario muestra los Tabs, si no, el AuthStack */}
            {user ? (
                <Tab.Navigator
                    initialRouteName="home"
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color }) => screenOptions(route, color),
                        
                        // 1. Colores de los íconos
                        tabBarActiveTintColor: "#00e5ff", // Cian neón cuando está seleccionado
                        tabBarInactiveTintColor: "#8a98ac", // Gris azulado cuando no está seleccionado
                        
                        // 2. Ocultar el header del Tab
                        headerShown: false,
                        
                        // 3. Estilo de la barra inferior (¡AQUÍ ESTÁ LA MAGIA OSCURA!)
                        tabBarStyle: {
                            backgroundColor: '#0d0f12', // Gris súper oscuro
                            borderTopWidth: 1,
                            borderTopColor: 'rgba(0, 229, 255, 0.2)', // Borde superior cian transparente
                            elevation: 10, // Sombra en Android
                            shadowColor: '#00e5ff', // Sombra de neón
                        }
                    })}
                >
                    <Tab.Screen name="home" component={HomeStack} options={{ title: "Inicio" }} />
                    <Tab.Screen name="test-model" component={TestStack} options={{ title: "Test" }} />
                    <Tab.Screen name="prueba-model" component={PruebaStack} options={{ title: "Test2" }} />
                    <Tab.Screen name="historia" component={HistorialStack} options={{ title: "Historia" }} />
                    <Tab.Screen name="account" component={AccountStack} options={{ title: "Cuenta" }} />
                </Tab.Navigator>
            ) : (
                <AuthStack />
            )}
            <Toast />
        </NavigationContainer>
    );
}