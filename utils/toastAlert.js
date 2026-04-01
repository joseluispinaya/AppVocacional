import Toast from 'react-native-toast-message';

// Función para alertas de Éxito (Verde)
export const showSuccessToast = (title = '¡Éxito!', message) => {
    Toast.show({
        type: 'success',
        text1: title,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
    });
};

export const showLogoutToast = (title = '¡Éxito!', message) => {
    Toast.show({
        type: 'success',
        text1: title,
        text2: message,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
    });
};

// Función para alertas de Error/Atención (Rojo)
export const showErrorToast = (title = 'Atención', message) => {
    Toast.show({
        type: 'error',
        text1: title,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
    });
};

// Función para alertas de Información (Opcional, Azul/Gris)
export const showInfoToast = (title = 'Información', message) => {
    Toast.show({
        type: 'info',
        text1: title,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
    });
};