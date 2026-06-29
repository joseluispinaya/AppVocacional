import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// 1. IMPORTA EL NUEVO COMPONENTE en la parte superior
import LoadingIA from '../../components/LoadingIA';

import Loading from '../../components/Loading';
import Modal from '../../components/Modal';

import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../utils/apiConfig';

export default function TestPrueba() {
    const { user } = useContext(AuthContext); 
    const navigation = useNavigation();

    // NUEVOS ESTADOS PARA EL MODAL DE ERROR DE IA
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [mensajeErrorIA, setMensajeErrorIA] = useState("");

    // 2. NUEVOS ESTADOS para manejar el flujo en dos pasos
    const [isGeneratingIA, setIsGeneratingIA] = useState(false);
    const [preguntasDescargadas, setPreguntasDescargadas] = useState(null);

    const [loading, setLoading] = useState(false);
    const [preguntas, setPreguntas] = useState([]); 
    const [respuestasUsuario, setRespuestasUsuario] = useState({});

    // Efecto de limpieza al salir de la pantalla
    useFocusEffect(
        useCallback(() => {
            return () => {
                setPreguntas([]);
                setRespuestasUsuario({});

                // ¡Tus excelentes adiciones!
                setPreguntasDescargadas(null); 
                setIsGeneratingIA(false); // Apagamos la animación por si el usuario salió a la mitad del contador
            };
        }, [])
    );

    // NUEVO EFECTO: Aquí resolvemos la lógica cuando la IA y la descarga terminan
    useEffect(() => {
        // Solo actuamos si el contador YA terminó (isGeneratingIA es false) 
        // Y si tenemos algo en preguntasDescargadas
        if (!isGeneratingIA && preguntasDescargadas !== null) {
            
            if (preguntasDescargadas.error) {
                Alert.alert("Error", preguntasDescargadas.error);
                setPreguntasDescargadas(null); // Limpiamos para no crear bucles
            } else {
                setPreguntas(preguntasDescargadas);
                setPreguntasDescargadas(null); // Limpiamos el temporal
            }
        }
    }, [isGeneratingIA, preguntasDescargadas]); // Se ejecuta cuando estos cambian

    // 1. Obtener preguntas generadas por IA
    const iniciarTest = async () => {
        // Mostramos el overlay inmersivo de los 3 segundos
        setIsGeneratingIA(true);
        setRespuestasUsuario({});
        setPreguntasDescargadas(null); // Limpiamos por si acaso

        try {
            // Asegúrate de que esta URL apunte a tu nuevo método en PreguntasController
            // Ejemplo: /preguntas/preguntasModelo
            const response = await fetch(`${API_URL}/respuestas/preguntasModelo`);
            const data = await response.json();

            if (!data.Estado) {
                // Si falla, guardamos el error para mostrarlo después del contador
                setPreguntasDescargadas({ error: data.Mensaje || "Error al generar preguntas con IA" });
                //Alert.alert("Atención", data.Mensaje || "Error al generar preguntas con IA");
            } else {
                // data.Data es el array: [{"Pregunta": "¿Te gusta...?"}, {...}]
                //setPreguntas(data.Data);
                // Si tiene éxito, guardamos las preguntas temporalmente
                setPreguntasDescargadas(data.Data);
            }
        } catch (e) {
            console.log(e);
            setPreguntasDescargadas({ error: "Error de conexión con el servidor" });
            //Alert.alert("Error", "Error de conexión con el servidor");
        }
    };

    // 4. FUNCIÓN QUE SE EJECUTA CUANDO EL CONTADOR LLEGA A CERO
    const handleCountdownComplete = () => {
        setIsGeneratingIA(false); // Ocultamos el Loading de IA
    };

    // 2. Manejar el cambio de texto. Ahora usamos el index (i) de la pregunta como 'key'
    const handleRespuestaChange = (index, texto) => {
        setRespuestasUsuario(prevState => ({
            ...prevState,
            [index]: texto
        }));
    };

    const enviarRespuestas = async () => {
        const totalPreguntas = preguntas.length;
        // Contamos cuántas respuestas no están vacías
        const respuestasDadas = Object.values(respuestasUsuario).filter(texto => texto.trim() !== "").length;

        if (totalPreguntas === 0) return;

        if (respuestasDadas < totalPreguntas) {
            Alert.alert("Faltan respuestas", "Por favor responde todas las preguntas antes de enviar.");
            return;
        }

        setLoading(true);
        
        // ARMAMOS EL PAYLOAD EXACTAMENTE COMO EN POSTMAN
        // Mapeamos el array original de preguntas usando su índice para buscar la respuesta
        const payload = {
            IdEstudiante: user.IdEstudiante, 
            Respuestas: preguntas.map((p, index) => ({
                Pregunta: p.Pregunta, // Texto de la pregunta generada por IA
                RespuestaTest: respuestasUsuario[index] || "" // Respuesta ingresada por el usuario
            }))
        };

        try {
            // Asegúrate de que apunte al nuevo controlador/ruta
            const response = await fetch(`${API_URL}/respuestas/procesarTest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.Estado) {
                Alert.alert("¡Test Finalizado!", "Tus resultados han sido generados por nuestro modelo.", [
                    {
                        text: "Ver Resultados",
                        onPress: () => {
                            setPreguntas([]);
                            setRespuestasUsuario({});
                            
                            // Navegamos pasando la Data completa
                            navigation.navigate('resultado-screen', { 
                                resultadoIA: data.Data, 
                                nombreEstudiante: `${user.Nombres} ${user.Apellidos}` 
                            });
                        }
                    }
                ]);
            } else {
                // Si la IA detecta respuestas ilógicas, caerá aquí gracias a tu validación en C#
                //Alert.alert("Análisis de IA", data.Mensaje || "No se pudo procesar el test.");

                // AQUÍ HACEMOS EL CAMBIO:
                // Guardamos el mensaje que mandó la IA (desde C#) y mostramos el Modal
                setMensajeErrorIA(data.Mensaje || "Las respuestas no tienen coherencia. Por favor, sé sincero.");
                setShowErrorModal(true);
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un error al enviar tus respuestas.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Enviar el test a la API
    const enviarRespuestasPrueba = async () => {
        const totalPreguntas = preguntas.length;
        // Contamos cuántas respuestas no están vacías
        const respuestasDadas = Object.values(respuestasUsuario).filter(texto => texto.trim() !== "").length;

        if (totalPreguntas === 0) return;

        if (respuestasDadas < totalPreguntas) {
            Alert.alert("Faltan respuestas", "Por favor responde todas las preguntas antes de enviar.");
            return;
        }

        setLoading(true);
        
        // ARMAMOS EL PAYLOAD EXACTAMENTE COMO EN POSTMAN
        // Mapeamos el array original de preguntas usando su índice para buscar la respuesta
        const payload = {
            IdEstudiante: user.IdEstudiante, 
            Respuestas: preguntas.map((p, index) => ({
                Pregunta: p.Pregunta, // Texto de la pregunta generada por IA
                RespuestaTest: respuestasUsuario[index] || "" // Respuesta ingresada por el usuario
            }))
        };

        console.log("=== PAYLOAD ARMADO PARA EL BACKEND ===");
        console.log(JSON.stringify(payload, null, 2));

        setTimeout(() => {
            // Detenemos el spinner
            setLoading(false);
            
            // Mostramos el Alert quemado
            Alert.alert(
                "Simulación Exitosa", 
                "El payload se armó correctamente. Revisa la consola de tu emulador/terminal para ver el JSON estructurado."
            );
        }, 3000);
        

    };

    if (!user) return <Loading isVisible={true} text="Cargando perfil..." />;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                
                {/* --- HEADER --- */}
                <View style={styles.headerCard}>
                    {/* <View style={styles.headerTitleContainer}>
                        <View style={styles.iconWrapper}>
                            <Ionicons name="sparkles" size={24} color="#00e5ff" />
                        </View>
                        <Text style={styles.headerTitleText}>
                            Hola, {user.Nombres}
                        </Text>
                    </View> */}

                    <View style={styles.headerImageContainer}>
                        <Image 
                            source={{ uri: 'https://fabkevin-003-site1.anytempurl.com/images/villanewlogo.jpg' }}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                    </View>

                    {preguntas.length === 0 && (
                        <>
                            <View style={styles.divider} />
                            <Button
                                title=" Generar Test Inteligente"
                                onPress={iniciarTest}
                                icon={<Ionicons name="bulb-outline" size={22} color="white" />}
                                titleStyle={{ fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}
                                buttonStyle={styles.actionButton}
                                containerStyle={styles.fullButtonContainer}
                                raised
                            />
                        </>
                    )}

                    {/* <View style={styles.divider} /> */}

                    {/* <View style={styles.buttonsRow}>
                        {preguntas.length === 0 && (
                            <Button
                                title=" Generar Test"
                                onPress={iniciarTest}
                                icon={<Ionicons name="bulb-outline" size={22} color="white" />}
                                titleStyle={{ fontWeight: 'bold', fontSize: 14 }}
                                buttonStyle={styles.actionButton}
                                containerStyle={styles.halfButtonContainer}
                                raised
                            />
                        )}
                    </View> */}
                </View>

                {/* --- ZONA DE PREGUNTAS --- */}
                {preguntas.length > 0 && (
                    <View style={styles.questionsContainer}>
                        <Text style={styles.questionsTitle}>Responde con sinceridad:</Text>

                        {preguntas.map((p, i) => (
                            <View key={`pregunta-${i}`} style={styles.questionCard}>
                                <View style={styles.questionHeader}>
                                    <View style={styles.questionIndexCircle}>
                                        <Text style={styles.questionIndexText}>{i + 1}</Text>
                                    </View>
                                    <Text style={styles.questionText}>{p.Pregunta}</Text>
                                </View>

                                <Input
                                    placeholder="Escribe tu respuesta aquí..."
                                    placeholderTextColor="#6b7280"
                                    // Usamos el índice (i) para leer y escribir el estado
                                    value={respuestasUsuario[i] || ''}
                                    onChangeText={(text) => handleRespuestaChange(i, text)}
                                    inputContainerStyle={styles.inputBox}
                                    inputStyle={styles.inputText}
                                    containerStyle={{ paddingHorizontal: 0, marginTop: 10, height: 50 }}
                                    multiline={false}
                                />
                            </View>
                        ))}

                        <Button
                            title=" Procesar Respuestas"
                            onPress={enviarRespuestas}
                            icon={<Ionicons name="paper-plane" size={20} color="#fff" />}
                            buttonStyle={styles.submitButton}
                            containerStyle={{ marginVertical: 25, marginHorizontal: 20, borderRadius: 12 }}
                            titleStyle={{ fontWeight: 'bold', letterSpacing: 1 }}
                            raised
                        />
                    </View>
                )}

                <Loading isVisible={loading} text="Analizando respuestas..." />

                <LoadingIA 
                    isVisible={isGeneratingIA} 
                    onCountdownComplete={handleCountdownComplete} 
                />

                <Modal isVisible={showErrorModal} setVisible={setShowErrorModal}>
                    <View style={styles.modalContentContainer}>
                        {/* Icono llamativo de advertencia */}
                        <View style={styles.modalIconWrapper}>
                            <Ionicons name="warning" size={45} color="#FFD700" />
                        </View>
                        
                        <Text style={styles.modalTitle}>Análisis Detenido</Text>
                        
                        <Text style={styles.modalText}>
                            {mensajeErrorIA}
                        </Text>
                        
                        <Button
                            title=" Corregir Respuestas"
                            onPress={() => setShowErrorModal(false)}
                            icon={<Ionicons name="create-outline" size={20} color="#0d0f12" />}
                            buttonStyle={styles.modalButton}
                            titleStyle={styles.modalButtonText}
                            containerStyle={{ width: '100%', borderRadius: 10 }}
                        />
                    </View>
                </Modal>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050505", // Fondo oscuro profundo
        paddingTop: 15
    },
    headerCard: {
        backgroundColor: '#0d0f12',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        shadowColor: '#00e5ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    headerImageContainer: {
        width: '100%',
        height: 180, // Altura ideal para que el robot se vea imponente pero sin ocupar toda la pantalla
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLogo: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 15,
    },
    fullButtonContainer: {
        width: '100%',
        borderRadius: 10,
        marginTop: 5,
    },
    /* headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        padding: 8,
        borderRadius: 20,
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#ffffff',
        marginLeft: 12,
        flex: 1
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 15,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    halfButtonContainer: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#0d0f12'
    }, */
    actionButton: {
        backgroundColor: '#442484',
        borderRadius: 10,
        paddingVertical: 14,
    },
    questionsContainer: {
        paddingBottom: 20
    },
    questionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 15,
        color: '#8a98ac', // Gris azulado
        letterSpacing: 0.5
    },
    questionCard: {
        backgroundColor: '#0d0f12',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    questionIndexCircle: {
        backgroundColor: 'rgba(232, 102, 255, 0.15)', // Tono magenta suave
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 2
    },
    questionIndexText: {
        fontWeight: 'bold',
        color: '#e866ff',
        fontSize: 14
    },
    questionText: {
        fontSize: 15,
        color: '#ffffff',
        fontWeight: '500',
        flex: 1,
        lineHeight: 22
    },
    inputBox: {
        borderBottomWidth: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.03)', // Fondo transparente
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)', // Borde cian
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45
    },
    inputText: {
        color: '#ffffff',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#00a8cc', // Azul/Cian vibrante para diferenciarlo
        borderRadius: 12,
        paddingVertical: 15,
    },
    // ... tus otros estilos ...
    
    modalContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalIconWrapper: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Fondo amarillento translúcido
        padding: 15,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFD700', // Dorado para la alerta
        marginBottom: 10,
        letterSpacing: 1,
    },
    modalText: {
        fontSize: 15,
        color: '#e2e8f0',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    modalButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        borderRadius: 10,
    },
    modalButtonText: {
        color: '#0d0f12', // Texto oscuro para contrastar con el botón dorado
        fontWeight: 'bold',
        fontSize: 16,
    }
});