import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- CAMBIO AQUÍ
import TestVocacional from '../screens/test/TestVocacional'
import ResultTest from '../screens/test/ResultTest'

// Inicializamos el Native Stack
const Stack = createNativeStackNavigator(); // <-- CAMBIO AQUÍ

export default function TestStack() {
  return (
    <Stack.Navigator>
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