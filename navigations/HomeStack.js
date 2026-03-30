import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- CAMBIO AQUÍ
import Home from '../screens/Home'

// Inicializamos el Native Stack
const Stack = createNativeStackNavigator(); // <-- CAMBIO AQUÍ

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="home-screen"
                component={Home}
                options={{ title: "Inicio" }}
            />
        </Stack.Navigator>
    )
}