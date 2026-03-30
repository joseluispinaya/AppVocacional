import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- CAMBIO AQUÍ
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';

// Inicializamos el Native Stack
const Stack = createNativeStackNavigator(); // <-- CAMBIO AQUÍ

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login-screen" component={Login} />
      <Stack.Screen name="register-screen" component={Register} />
    </Stack.Navigator>
  )
}