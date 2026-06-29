import React, { useState, useContext } from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';

// 1. Importamos nuestras alertas globales
import { showErrorToast, showSuccessToast } from '../../utils/toastAlert';
import { AuthContext } from '../../context/AuthContext';

// 1. IMPORTAMOS LA URL DESDE NUESTRO ARCHIVO CENTRAL
import { API_URL } from '../../utils/apiConfig';


export default function Login() {
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [errorUsuario, setErrorUsuario] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    
    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLoginApi = async () => {
        if (!usuario.trim()) {
            setErrorUsuario('Ingrese su correo');
            return;
        }
        if (!password.trim()) {
            setErrorPassword('Ingrese su Clave');
            return;
        }

        setLoading(true);
        setErrorUsuario('');
        setErrorPassword('');

        try {
            const loginDTO = {
                Correo: usuario,
                Clave: password
            };
            
            const response = await fetch(`${API_URL}/estudiantes/loginApp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginDTO),
            });
            const data = await response.json();

            if (!data.Estado) {
                // 2. Usamos la alerta global de error
                showErrorToast('Atención', data.Mensaje);
            } else {
                await login(data.Data);
                // 3. Usamos la alerta global de éxito
                showSuccessToast('¡Bienvenido!', data.Mensaje);
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* LOGO CON EFECTO DE FUSIÓN Y RESPLANDOR */}
                <View style={styles.logoContainer}>
                    <View style={styles.imageWrapper}>
                        <Image 
                            source={require('../../assets/logodefault.png')} 
                            style={styles.logo} 
                            resizeMode="contain" 
                        />
                    </View>
                    <Text style={styles.title}>INICIAR SESIÓN</Text>
                    <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>
                </View>

                {/* FORMULARIO */}
                <View style={styles.formContainer}>
                    <Input
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor="#6b7280"
                        value={usuario}
                        errorMessage={errorUsuario}
                        onChangeText={(text) => {
                            setUsuario(text);
                            if (errorUsuario) setErrorUsuario('');
                        }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        leftIcon={<Ionicons name="mail" size={20} color="#00e5ff" />}
                        containerStyle={styles.inputContainer}
                        inputContainerStyle={styles.inputStyle}
                        inputStyle={styles.inputText}
                        errorStyle={styles.errorText}
                    />

                    <Input
                        placeholder="********"
                        placeholderTextColor="#6b7280"
                        value={password}
                        errorMessage={errorPassword}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errorPassword) setErrorPassword('');
                        }}
                        secureTextEntry={!showPassword}
                        leftIcon={<Ionicons name="lock-closed" size={20} color="#00e5ff" />}
                        rightIcon={
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={22}
                                color="#8a98ac"
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        containerStyle={styles.inputContainer}
                        inputContainerStyle={styles.inputStyle}
                        inputStyle={styles.inputText}
                        errorStyle={styles.errorText}
                    />

                    <Button
                        title=" INGRESAR"
                        icon={<Ionicons name="log-in-outline" size={22} color="#fff" />}
                        onPress={handleLoginApi}
                        buttonStyle={styles.loginButton}
                        containerStyle={styles.buttonContainer}
                        titleStyle={{ fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}
                        raised
                    />

                    <Text style={styles.register} onPress={() => navigation.navigate("register-screen")}>
                        ¿Aún no tienes una cuenta?{" "}
                        <Text style={styles.btnRegister}>Regístrate</Text>
                    </Text>
                </View>

                <Loading isVisible={loading} text="Iniciando Sesión..." />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505', // Fondo oscuro principal
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 25,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 35,
    },
    imageWrapper: {
        width: 140,
        height: 140,
        backgroundColor: '#000000', // Funde el fondo de la imagen
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        // Sombra de resplandor neón
        shadowColor: '#00e5ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    subtitle: {
        color: '#8a98ac',
        fontSize: 14,
        marginTop: 5,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#0d0f12', // Tarjeta oscura sutil
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputContainer: {
        marginBottom: 5,
        paddingHorizontal: 0,
    },
    inputStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderBottomWidth: 0,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 55,
    },
    inputText: {
        color: '#ffffff',
        fontSize: 15,
        marginLeft: 10,
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 12,
        marginLeft: 5,
    },
    loginButton: {
        backgroundColor: '#442484', // Tu color violeta principal
        borderRadius: 10,
        paddingVertical: 14,
    },
    buttonContainer: {
        marginTop: 15,
        width: '100%',
        borderRadius: 10,
        shadowColor: '#442484',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    register: {
        marginTop: 25,
        textAlign: 'center',
        fontSize: 14,
        color: '#8a98ac',
    },
    btnRegister: {
        color: "#00e5ff", // Enlace en cian neón
        fontWeight: "bold",
    }
});