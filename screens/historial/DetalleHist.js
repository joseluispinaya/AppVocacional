import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Button, LinearProgress, Badge } from '@rneui/themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Loading from '../../components/Loading';

const API_URL = 'https://fabkevin-003-site1.anytempurl.com/api';

export default function DetalleHist() {
    const route = useRoute();
    const navigation = useNavigation();
    
    // Recibimos el ID y la fecha del test seleccionado
    const { idTest, fecha } = route.params || {};

    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!idTest) {
            Alert.alert("Error", "No se recibió el identificador del test.");
            navigation.goBack();
            return;
        }
        cargarDetalle();
    }, [idTest]);

    const cargarDetalle = async () => {
        try {
            const response = await fetch(`${API_URL}/historiales/detalleHist/${idTest}`);
            const data = await response.json();

            if (data.Estado) {
                setDetalles(data.Data);
            } else {
                Alert.alert("Aviso", data.Mensaje || "No se pudo cargar el detalle.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Problema de conexión al buscar el detalle.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading isVisible={true} text="Cargando recomendaciones..." />;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            
            <View style={styles.headerIndicator}>
                <Ionicons name="calendar" size={16} color="#e866ff" style={{ marginRight: 5 }} />
                <Text style={styles.headerIndicatorText}>Resultados del: {fecha}</Text>
            </View>

            <Text style={styles.sectionTitle}>Carreras Sugeridas</Text>

            {/* LISTA DE CARRERAS */}
            {detalles.map((item, index) => {
                const puntaje = parseFloat(item.Puntaje);
                let colorProgress = "#00e5ff"; // Cian
                if (puntaje < 80) colorProgress = "#e866ff"; // Magenta
                if (puntaje < 60) colorProgress = "#ff4d4d"; // Rojo

                return (
                    <View key={index} style={styles.careerCard}>
                        <View style={styles.careerHeader}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="school" size={16} color="#ffffff" />
                            </View>
                            <Text style={styles.careerTitle}>{item.Carrera}</Text>

                            <Badge
                                value={`${puntaje.toFixed(1)} %`}
                                badgeStyle={{ backgroundColor: 'rgba(0, 229, 255, 0.15)', height: 26, paddingHorizontal: 10, borderColor: '#00e5ff', borderWidth: 1 }}
                                textStyle={{ fontSize: 13, fontWeight: 'bold', color: '#00e5ff' }}
                            />
                        </View>

                        <View style={{ marginBottom: 12, marginTop: 10 }}>
                            <View style={styles.progressRow}>
                                <Text style={styles.scoreLabel}>Nivel de compatibilidad</Text>
                            </View>
                            <LinearProgress
                                value={puntaje / 100}
                                variant="determinate"
                                color={colorProgress}
                                trackColor="rgba(255, 255, 255, 0.05)"
                                style={{ height: 6, borderRadius: 3 }}
                            />
                        </View>

                        <View style={styles.justificationBox}>
                            <Text style={styles.justificationTitle}><Ionicons name="bulb-outline" size={14} color="#8a98ac" />  Afinidad detectada:</Text>
                            <Text style={styles.justificationText}>
                                {item.Justificacion}
                            </Text>
                        </View>
                    </View>
                );
            })}

            {/* BOTÓN VOLVER */}
            <View style={styles.buttonWrapper}>
                <Button
                    title=" Volver al Historial"
                    onPress={() => navigation.goBack()}
                    icon={<Ionicons name="arrow-back-circle-outline" size={20} color="white" />}
                    buttonStyle={styles.actionButton}
                    titleStyle={{ fontSize: 15, fontWeight: 'bold' }}
                />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505', paddingTop: 10 },
    headerIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(232, 102, 255, 0.1)', alignSelf: 'center', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(232, 102, 255, 0.3)' },
    headerIndicatorText: { color: '#e866ff', fontWeight: 'bold', fontSize: 13 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 15, color: '#00e5ff', letterSpacing: 0.5 },
    
    // Estilos Card Carreras
    careerCard: { backgroundColor: '#0d0f12', borderRadius: 15, padding: 15, marginBottom: 15, marginHorizontal: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    careerHeader: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: { backgroundColor: '#442484', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    careerTitle: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', flex: 1, marginRight: 10 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    scoreLabel: { fontSize: 12, color: '#8a98ac' },
    justificationBox: { backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: 12, borderRadius: 10, marginTop: 5 },
    justificationTitle: { fontWeight: 'bold', fontSize: 12, color: '#8a98ac', marginBottom: 4 },
    justificationText: { fontSize: 13, color: '#d1d5db', lineHeight: 20, textAlign: 'justify' },
    
    // Estilos Botón
    buttonWrapper: { marginHorizontal: 15, marginTop: 10, borderRadius: 10, backgroundColor: '#0d0f12' },
    actionButton: { backgroundColor: '#442484', borderRadius: 10, paddingVertical: 14 }
});