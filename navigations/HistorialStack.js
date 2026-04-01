import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- CAMBIO AQUÍ
import HistorialTest from '../screens/historial/HistorialTest'
import DetalleHist from '../screens/historial/DetalleHist'

// Inicializamos el Native Stack
const Stack = createNativeStackNavigator(); // <-- CAMBIO AQUÍ

export default function HistorialStack() {
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
        name="historial-screen"
        component={HistorialTest}
        options={{ title: "Historial" }}
      />
      <Stack.Screen
        name="detalle-screen"
        component={DetalleHist}
        options={{ title: "Detalle Test" }}
      />
    </Stack.Navigator>
  )
}