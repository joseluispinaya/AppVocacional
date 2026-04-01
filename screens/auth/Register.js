import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Input, Button, Avatar } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker'; // <-- NUEVA LIBRERÍA

import Loading from '../../components/Loading';
import { showErrorToast, showSuccessToast, showInfoToast } from '../../utils/toastAlert';
import { Asset } from 'expo-asset';

const defaultAvatar = Asset.fromModule(
    require('../../assets/no-image.png')
).uri;

const API_URL = 'http://joseluis1989-008-site2.ltempurl.com/api';

export default function Register() {
    const navigation = useNavigation();

    // Estados del formulario
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [ci, setCi] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    // Estados para la Unidad Educativa (Dropdown)
    const [openUnidad, setOpenUnidad] = useState(false);
    const [unidadValue, setUnidadValue] = useState(null);
    const [unidades, setUnidades] = useState([]);

    // Estados de la Imagen
    const [imageUri, setImageUri] = useState(null); // Para mostrar en pantalla
    const [imageBase64, setImageBase64] = useState(''); // Para enviar al backend

    // Estados de UI
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState({});

    // 1. OBTENER UNIDADES EDUCATIVAS AL CARGAR LA PANTALLA
    useEffect(() => {
        const fetchUnidades = async () => {
            try {
                const response = await fetch(`${API_URL}/estudiantes/combo`);
                const result = await response.json();

                if (result.Estado) {
                    // Mapeamos los datos para que el Dropdown los entienda (label y value)
                    const dataMapeada = result.Data.map(item => ({
                        label: item.Nombre,
                        value: item.IdUnidadEducativa
                    }));
                    setUnidades(dataMapeada);
                }
            } catch (error) {
                console.log("Error al cargar unidades educativas:", error);
            }
        };

        fetchUnidades();
    }, []);

    // 2. FUNCIÓN PARA SELECCIONAR IMAGEN
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            showErrorToast('Permiso denegado', 'Necesitamos acceso a la galería para subir tu foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5, // Reducimos un poco la calidad para que el base64 no sea tan pesado
            base64: true, // ¡CRÍTICO para tu backend!
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // Para que se vea en el Avatar
            setImageBase64(result.assets[0].base64); // Guardamos la cadena para C#
        }
    };

    // 3. VALIDACIÓN INCLUYENDO LA UNIDAD EDUCATIVA
    const validarFormulario = () => {
        let nuevosErrores = {};

        if (!unidadValue) nuevosErrores.unidad = 'Seleccione una Unidad Educativa'; // Validación del Select
        if (!nombres.trim()) nuevosErrores.nombres = 'El nombre es requerido';
        if (!apellidos.trim()) nuevosErrores.apellidos = 'Los apellidos son requeridos';
        if (!ci.trim()) nuevosErrores.ci = 'El CI es requerido';
        if (!correo.trim() || !correo.includes('@')) nuevosErrores.correo = 'Ingrese un correo válido';
        if (!password.trim() || password.length < 6) nuevosErrores.password = 'Mínimo 6 caracteres';

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleRegisterApi = async () => {
        if (!validarFormulario()) return;

        setLoading(true);

        try {
            const objeto = {
                IdUnidadEducativa: unidadValue, // <-- AHORA ENVIAMOS EL ID SELECCIONADO
                NroCi: ci,
                Nombres: nombres,
                Apellidos: apellidos,
                Correo: correo,
                ClaveHash: password,
                Photo: '',
                Base64Image: imageBase64
            };

            const response = await fetch(`${API_URL}/estudiantes/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objeto),
            });

            const data = await response.json();

            if (!data.Estado) {
                if (data.Valor === 'warning') {
                    showInfoToast('Atención', data.Mensaje);
                } else {
                    showErrorToast('Error', data.Mensaje);
                }
            } else {
                showSuccessToast('¡Cuenta Creada!', 'Ahora puedes iniciar sesión.');
                navigation.navigate('login-screen');
            }

        } catch (e) {
            console.log("Error en registro:", e);
            showErrorToast('Error de Conexión', 'No se pudo contactar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                {/* nestedScrollEnabled es útil cuando source={{ uri: imageUri || defaultAvatar }} tienes un dropdown dentro de un scrollview en Android */}
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={pickImage} style={styles.avatarBorder}>
                            <Avatar
                                size={110}
                                rounded
                                source={{ uri: imageUri || defaultAvatar }}
                                containerStyle={{ backgroundColor: '#1a1d24' }}
                            >
                                <Avatar.Accessory
                                    size={32}
                                    name="camera-outline"
                                    type="ionicon"
                                    color="#fff"
                                    style={{ backgroundColor: '#00e5ff', borderRadius: 20 }}
                                />
                            </Avatar>
                        </TouchableOpacity>
                        <Text style={styles.title}>Crea tu cuenta</Text>
                        <Text style={styles.subtitle}>Completa tus datos para iniciar el test</Text>
                    </View>

                    <View style={styles.formContainer}>

                        {/* SELECT: UNIDAD EDUCATIVA */}
                        {/* Le damos un zIndex alto para que la lista desplegable se ponga por encima de los demás inputs */}
                        <View style={{ zIndex: 1000, marginBottom: 15, paddingHorizontal: 10 }}>
                            <DropDownPicker
                                open={openUnidad}
                                value={unidadValue}
                                items={unidades}
                                setOpen={setOpenUnidad}
                                setValue={setUnidadValue}
                                setItems={setUnidades}
                                placeholder="Seleccione su Unidad Educativa"
                                theme="DARK" // Trae colores oscuros por defecto
                                style={styles.dropdownStyle}
                                dropDownContainerStyle={styles.dropdownListStyle}
                                textStyle={styles.dropdownText}
                                placeholderStyle={styles.dropdownPlaceholder}
                                onChangeValue={() => setErrores({ ...errores, unidad: '' })}
                                listMode="SCROLLVIEW" // Importante para que funcione dentro del Scroll general
                            />
                            {/* Mensaje de error para el Dropdown (mismo estilo que RNEUI) */}
                            {errores.unidad && <Text style={styles.errorTextDrop}>{errores.unidad}</Text>}
                        </View>

                        {/* RESTO DE LOS INPUTS... (Igual que antes) */}
                        <Input
                            placeholder="Nombres"
                            placeholderTextColor="#6b7280"
                            value={nombres}
                            errorMessage={errores.nombres}
                            onChangeText={(text) => { setNombres(text); setErrores({ ...errores, nombres: '' }); }}
                            leftIcon={<Ionicons name="person-outline" size={20} color="#00e5ff" />}
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputStyle}
                            inputStyle={styles.inputText}
                            errorStyle={styles.errorText}
                        />

                        <Input
                            placeholder="Apellidos"
                            placeholderTextColor="#6b7280"
                            value={apellidos}
                            errorMessage={errores.apellidos}
                            onChangeText={(text) => { setApellidos(text); setErrores({ ...errores, apellidos: '' }); }}
                            leftIcon={<Ionicons name="people-outline" size={20} color="#00e5ff" />}
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputStyle}
                            inputStyle={styles.inputText}
                            errorStyle={styles.errorText}
                        />

                        <Input
                            placeholder="Nro de CI"
                            placeholderTextColor="#6b7280"
                            value={ci}
                            keyboardType="numeric"
                            errorMessage={errores.ci}
                            onChangeText={(text) => { setCi(text); setErrores({ ...errores, ci: '' }); }}
                            leftIcon={<Ionicons name="card-outline" size={20} color="#00e5ff" />}
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputStyle}
                            inputStyle={styles.inputText}
                            errorStyle={styles.errorText}
                        />

                        <Input
                            placeholder="Correo Electrónico"
                            placeholderTextColor="#6b7280"
                            value={correo}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            errorMessage={errores.correo}
                            onChangeText={(text) => { setCorreo(text); setErrores({ ...errores, correo: '' }); }}
                            leftIcon={<Ionicons name="mail-outline" size={20} color="#00e5ff" />}
                            containerStyle={styles.inputContainer}
                            inputContainerStyle={styles.inputStyle}
                            inputStyle={styles.inputText}
                            errorStyle={styles.errorText}
                        />

                        <Input
                            placeholder="Contraseña"
                            placeholderTextColor="#6b7280"
                            value={password}
                            errorMessage={errores.password}
                            onChangeText={(text) => { setPassword(text); setErrores({ ...errores, password: '' }); }}
                            secureTextEntry={!showPassword}
                            leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#00e5ff" />}
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
                            title=" REGISTRARME"
                            icon={<Ionicons name="person-add-outline" size={20} color="#fff" />}
                            onPress={handleRegisterApi}
                            buttonStyle={styles.registerButton}
                            containerStyle={styles.buttonContainer}
                            titleStyle={{ fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}
                            raised
                        />

                        <Text style={styles.footerText} onPress={() => navigation.goBack()}>
                            ¿Ya tienes cuenta? <Text style={styles.btnLogin}>Inicia Sesión</Text>
                        </Text>

                    </View>

                    <Loading isVisible={loading} text="Creando cuenta..." />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // NUEVO ESTILO PARA PROTEGER LOS BORDES
    safeArea: {
        flex: 1,
        backgroundColor: '#050505', // Mismo fondo para que no se note el corte
    },
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20, // Un padding parejo para todos los lados
        paddingBottom: 25, // Un espacio pequeño para que el texto final respire, SafeArea hace el resto
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 15,
    },
    avatarBorder: {
        borderWidth: 2,
        borderColor: '#00e5ff',
        padding: 3,
        borderRadius: 100,
        marginBottom: 15,
        shadowColor: '#00e5ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: '#8a98ac',
        marginTop: 5,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#0d0f12',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    /* --- Estilos del Select Dropdown (Neón) --- */
    dropdownStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(0, 229, 255, 0.3)',
        borderRadius: 10,
        height: 55,
    },
    dropdownListStyle: {
        backgroundColor: '#0d0f12', // Fondo oscuro al abrirse
        borderColor: 'rgba(0, 229, 255, 0.5)',
    },
    dropdownText: {
        color: '#ffffff',
        fontSize: 15,
    },
    dropdownPlaceholder: {
        color: '#6b7280',
    },
    errorTextDrop: {
        color: '#ff4d4d',
        fontSize: 12,
        marginLeft: 5,
        marginTop: 5,
    },
    /* --- Estilos de Inputs Normales --- */
    inputContainer: {
        marginBottom: 2,
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
    registerButton: {
        backgroundColor: '#442484',
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
    footerText: {
        marginTop: 25,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 14,
        color: '#8a98ac'
    },
    btnLogin: {
        color: "#00e5ff",
        fontWeight: "bold"
    }
});