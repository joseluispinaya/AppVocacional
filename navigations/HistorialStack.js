import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- CAMBIO AQUÍ
import HistorialTest from '../screens/historial/HistorialTest'
import DetalleHist from '../screens/historial/DetalleHist'

// Inicializamos el Native Stack
const Stack = createNativeStackNavigator(); // <-- CAMBIO AQUÍ

export default function HistorialStack() {
  return (
    <Stack.Navigator>
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