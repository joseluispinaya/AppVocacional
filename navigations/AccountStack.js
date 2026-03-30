import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- CAMBIO AQUÍ
import Account from '../screens/account/Account'

// Inicializamos el Native Stack
const Stack = createNativeStackNavigator(); // <-- CAMBIO AQUÍ

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="account-screen"
                component={Account}
                options={{ title: "Cuenta" }}
            />
        </Stack.Navigator>
    )
}