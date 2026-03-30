import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user_data';

// GUARDAR (Set)
export const storeUserSession = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
    console.log('Usuario guardado en Storage exitosamente');
  } catch (e) {
    console.error('Error guardando usuario:', e);
  }
};

// OBTENER (Get)
export const getUserSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error recuperando usuario:', e);
    return null;
  }
};

// ELIMINAR "Salir o cerrar sesion"
export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log('Storage limpiado');
  } catch (e) {
    console.error('Error limpiando storage:', e);
  }
};