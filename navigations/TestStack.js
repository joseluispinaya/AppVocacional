import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- CAMBIO AQUÍ
import TestVocacional from '../screens/test/TestVocacional'
import ResultTest from '../screens/test/ResultTest'

// Inicializamos el Native Stack
const Stack = createNativeStackNavigator(); // <-- CAMBIO AQUÍ

export default function TestStack() {
  return (
    <Stack.Navigator
      // ESTILOS GLOBALES PARA TODAS LAS PANTALLAS DE ESTE STACK
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0d0f12', // Mismo fondo oscuro del menú inferior
        },
        headerTintColor: '#ffffff', // Letras y flechas de retroceso en color blanco
        headerTitleStyle: {
          fontWeight: 'bold',
          letterSpacing: 1, // Le da un toque más moderno a la fuente
        },
        // headerShadowVisible quita la línea blanca separadora que pone Android por defecto
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="test-screen"
        component={TestVocacional}
        options={{ title: "Test vocacional" }}
      />
      <Stack.Screen
        name="result-screen"
        component={ResultTest}
        options={{ title: "Resultado Test" }}
      />
    </Stack.Navigator>
  )
}