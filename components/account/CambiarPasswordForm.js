import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

import { showErrorToast, showLogoutToast } from '../../utils/toastAlert';
import { AuthContext } from '../../context/AuthContext';

const API_URL = 'http://joseluis1989-008-site2.ltempurl.com/api';

export default function CambiarPasswordForm({ setShowModal }) {
    const { user, logout } = useContext(AuthContext);

    const [password, setPassword] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorNewpassword, setErrorNewpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!password.trim()) {
            setErrorPassword('Ingrese su clave actual');
            return;
        }
        if (!newpassword.trim()) {
            setErrorNewpassword('Ingrese la nueva clave');
            return;
        }

        setLoading(true);
        setErrorPassword('');
        setErrorNewpassword('');

        try {
            // Armamos el objeto exactamente como lo espera tu ChangeDTO en C#
            const payload = {
                Correo: user.Correo, // Lo sacamos del AuthContext
                ClaveActual: password,
                ClaveNueva: newpassword
            };
            // SIMULACIÓN DE SOLICITUD AL BACKEND (2 seg)
            //await new Promise(resolve => setTimeout(resolve, 2000));

            // Asegúrate de que la ruta coincida con el RoutePrefix de tu controlador
            const response = await fetch(`${API_URL}/estudiantes/editClave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.Estado) {
                // Si todo fue bien, mostramos éxito, limpiamos inputs y cerramos modal
                showLogoutToast('¡Clave Actualizada!', 'Por seguridad, inicie sesión nuevamente.');
                //showSuccessToast('¡Actualizado!', 'Su clave se ha cambiado correctamente.');
                setPassword('');
                setNewpassword('');
                setShowModal(false);

                // 3. Esperamos 1.5 segundos para que lea el mensaje, y luego lo sacamos
                setTimeout(async () => {
                    await logout();
                }, 1500);

            } else {
                // Si la clave actual es incorrecta o hay otro error, lo mostramos
                showErrorToast('Error', data.Mensaje);
            }
        }
        catch (e) {
            console.log(e);
            showErrorToast('Error de Conexión', 'No se pudo contactar con el servidor.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.view}>
            <Text style={styles.title}>Cambiar Contraseña</Text>
            <Text style={styles.subtitle}>Ingresa tus credenciales para actualizar tu seguridad.</Text>

            <Input
                placeholder="Clave Actual"
                placeholderTextColor="#6b7280"
                value={password}
                errorMessage={errorPassword}
                onChangeText={(text) => {
                    setPassword(text);
                    if (errorPassword) setErrorPassword('');
                }}
                secureTextEntry={!showPassword}
                leftIcon={<Ionicons name="lock-closed" size={20} color="#00e5ff" />}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputBox}
                inputStyle={styles.inputText}
                errorStyle={styles.errorText}
            />

            <Input
                placeholder="Nueva Clave"
                placeholderTextColor="#6b7280"
                value={newpassword}
                errorMessage={errorNewpassword}
                onChangeText={(text) => {
                    setNewpassword(text);
                    if (errorNewpassword) setErrorNewpassword('');
                }}
                secureTextEntry={!showPassword}
                leftIcon={<Ionicons name="shield-checkmark" size={20} color="#e866ff" />}
                rightIcon={
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color="#8a98ac"
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputBox}
                inputStyle={styles.inputText}
                errorStyle={styles.errorText}
            />

            <Button
                title=" ACTUALIZAR CLAVE"
                icon={<Ionicons name="save-outline" size={20} color="#fff" />}
                onPress={onSubmit}
                loading={loading}
                buttonStyle={styles.saveButton}
                containerStyle={styles.buttonContainer}
                titleStyle={{ fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }}
                raised
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 13,
        color: '#8a98ac',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        paddingHorizontal: 0,
        marginBottom: 5,
    },
    inputBox: {
        borderBottomWidth: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
    },
    inputText: {
        color: '#ffffff',
        fontSize: 14,
        marginLeft: 10,
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 12,
        marginLeft: 5,
    },
    saveButton: {
        backgroundColor: '#442484',
        borderRadius: 10,
        paddingVertical: 14,
    },
    buttonContainer: {
        marginTop: 10,
        borderRadius: 10,
        width: '100%',
    }
});