import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Loading from '../../components/Loading';
// Importamos tu contexto de autenticación
import { AuthContext } from '../../context/AuthContext';

import { API_URL } from '../../utils/apiConfig';

export default function TestVocacional() {
    // Obtenemos el usuario directamente del contexto global ¡Mucho más limpio!
    const { user } = useContext(AuthContext); 
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [preguntas, setPreguntas] = useState([]);
    const [respuestasUsuario, setRespuestasUsuario] = useState({});

    // EFECTO DE LIMPIEZA: Se ejecuta cuando la pantalla pierde el foco (cuando el usuario se va)
    useFocusEffect(
        useCallback(() => {
            // Aquí podríamos poner código que se ejecuta al ENTRAR a la pantalla
            // Pero en este caso, solo nos interesa lo que pasa al SALIR.

            return () => {
                // Todo lo que pongas en este "return" se ejecuta al ABANDONAR la pantalla
                setPreguntas([]);
                setRespuestasUsuario({});
            };
        }, [])
    );

    const iniciarTest = async () => {
        setLoading(true);
        setRespuestasUsuario({});

        try {
            // Verifica la ruta exacta de tu controlador, por ejemplo: /preguntas/preguntasTest
            const response = await fetch(`${API_URL}/preguntas/preguntasTest`);
            const data = await response.json();

            // Usamos 'Estado' en lugar de 'wasSuccess' como en tu C#
            if (!data.Estado) {
                Alert.alert("Atención", data.Mensaje || "Error al obtener preguntas");
            } else {
                // Tu backend devuelve la lista en 'Data'
                setPreguntas(data.Data);
            }
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleRespuestaChange = (idPregunta, texto) => {
        setRespuestasUsuario(prevState => ({
            ...prevState,
            [idPregunta]: texto
        }));
    };

    const enviarRespuestas = async () => {
        const totalPreguntas = preguntas.length;
        const respuestasDadas = Object.values(respuestasUsuario).filter(texto => texto.trim() !== "").length;

        if (totalPreguntas === 0) return;

        if (respuestasDadas < totalPreguntas) {
            Alert.alert("Faltan respuestas", "Por favor responde todas las preguntas antes de enviar.");
            return;
        }

        setLoading(true);
        
        // Armamos el JSON EXACTO que espera tu SolicitudTestDTO en C#
        const payload = {
            IdEstudiante: user.IdEstudiante, // Sacamos el ID directamente del contexto
            Respuestas: preguntas.map(p => ({
                IdPregunta: p.IdPregunta, // Propiedad de tu PreguntaDTO
                TextoRespuesta: respuestasUsuario[p.IdPregunta] || ""
            }))
        };

        try {
            const response = await fetch(`${API_URL}/preguntas/procesar`, {
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
                            
                            // Navegamos pasando la Data completa de la IA y el nombre del estudiante
                            navigation.navigate('result-screen', { 
                                resultadoIA: data.Data, // Tu ResultadoIADTO
                                nombreEstudiante: `${user.Nombres} ${user.Apellidos}` 
                            });
                        }
                    }
                ]);
            } else {
                Alert.alert("Error", data.Mensaje || "No se pudo guardar el test.");
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un error al enviar tus respuestas.");
        } finally {
            setLoading(false);
        }
    };

    // Si por alguna extraña razón 'user' es null, no renderizamos nada o mostramos loading
    if (!user) return <Loading isVisible={true} text="Cargando perfil..." />;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                
                {/* --- TARJETA COMPACTA DE BIENVENIDA (ESTILO NEÓN) --- */}
                <View style={styles.headerCard}>
                    <View style={styles.headerTitleContainer}>
                        <View style={styles.iconWrapper}>
                            <Ionicons name="person" size={24} color="#00e5ff" />
                        </View>
                        <Text style={styles.headerTitleText}>
                            Hola, {user.Nombres}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* --- FILA DE BOTONES --- */}
                    <View style={styles.buttonsRow}>
                        {/* BOTÓN 1: INICIAR TEST */}
                        {preguntas.length === 0 && (
                            <Button
                                title=" Iniciar Test"
                                onPress={iniciarTest}
                                icon={<Ionicons name="play-circle-outline" size={22} color="white" />}
                                titleStyle={{ fontWeight: 'bold', fontSize: 15 }}
                                buttonStyle={styles.actionButton}
                                containerStyle={styles.halfButtonContainer}
                                raised
                            />
                        )}

                        {/* BOTÓN 2: EXPORTAR */}
                        <Button
                            title=" Exportar"
                            onPress={() => Alert.alert("Exportar", "Función próximamente disponible")}
                            icon={<Ionicons name="document-text-outline" size={20} color="white" />}
                            titleStyle={{ fontWeight: 'bold', fontSize: 15 }}
                            buttonStyle={[styles.actionButton, { backgroundColor: '#17a2b8' }]}
                            containerStyle={styles.halfButtonContainer}
                            raised
                        />
                    </View>
                </View>

                {/* --- ZONA DE PREGUNTAS --- */}
                {preguntas.length > 0 && (
                    <View style={styles.questionsContainer}>
                        <Text style={styles.questionsTitle}>Responde con sinceridad:</Text>

                        {preguntas.map((p, i) => (
                            <View key={p.IdPregunta} style={styles.questionCard}>
                                <View style={styles.questionHeader}>
                                    <View style={styles.questionIndexCircle}>
                                        <Text style={styles.questionIndexText}>{i + 1}</Text>
                                    </View>
                                    <Text style={styles.questionText}>{p.Texto}</Text>
                                </View>

                                <Input
                                    placeholder="Escribe tu respuesta aquí..."
                                    placeholderTextColor="#6b7280"
                                    value={respuestasUsuario[p.IdPregunta] || ''}
                                    onChangeText={(text) => handleRespuestaChange(p.IdPregunta, text)}
                                    inputContainerStyle={styles.inputBox}
                                    inputStyle={styles.inputText}
                                    containerStyle={{ paddingHorizontal: 0, marginTop: 10, height: 50 }}
                                    multiline={false}
                                />
                            </View>
                        ))}

                        <Button
                            title=" Procesar Respuestas con IA"
                            onPress={enviarRespuestas}
                            icon={<Ionicons name="sparkles" size={20} color="#fff" />}
                            buttonStyle={styles.submitButton}
                            containerStyle={{ marginVertical: 25, marginHorizontal: 20, borderRadius: 12 }}
                            titleStyle={{ fontWeight: 'bold', letterSpacing: 1 }}
                            raised
                        />
                    </View>
                )}

                <Loading isVisible={loading} text={preguntas.length > 0 ? "Analizando respuestas..." : "Cargando..."} />
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
    headerTitleContainer: {
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
        borderRadius: 10,           // Mismo radio que el actionButton
        backgroundColor: '#0d0f12' // Fondo oscuro de tu tarjeta para fundir el blanco
    },
    actionButton: {
        backgroundColor: '#442484', // Violeta principal
        borderRadius: 10,
        paddingVertical: 12,
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
    }
});