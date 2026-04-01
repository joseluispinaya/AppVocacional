import Navigation from './navigations/Navigation';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    // Envolvemos toda la navegación con el Proveedor de Autenticación
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
