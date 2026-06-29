import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, LinearProgress, Badge } from '@rneui/themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// IMPORTACIONES PARA PDF
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Importamos nuestra alerta global (si tienes el archivo)
import { showErrorToast, showSuccessToast } from '../../utils/toastAlert';

export default function ResultPrueba() {
    const route = useRoute();
    const navigation = useNavigation();

    // Recibimos los datos exactos que mandaste desde TestVocacional
    const { resultadoIA, nombreEstudiante = "Estudiante" } = route.params || {};
    const [loadingPdf, setLoadingPdf] = useState(false);

    if (!resultadoIA) {
        return (
            <View style={styles.containerCenter}>
                <Ionicons name="alert-circle-outline" size={60} color="#8a98ac" />
                <Text style={styles.noDataText}>No hay resultados disponibles.</Text>
                <Button 
                    title="Volver" 
                    onPress={() => navigation.goBack()} 
                    buttonStyle={styles.actionButton}
                />
            </View>
        );
    }

    // Destructuramos tu DTO de C#
    const { ObservacionGeneralIA, Recomendaciones } = resultadoIA;

    // Ordenamos las recomendaciones por el campo 'Orden' ascendente (1, 2, 3...)
    const recomendacionesOrdenadas = Recomendaciones 
        ? [...Recomendaciones].sort((a, b) => a.Orden - b.Orden) 
        : [];

    // ==============================================================
    // LÓGICA GENERAR PDF (Fondo Blanco Corporativo para Imprimir)
    // ==============================================================
    const generarPDF = async () => {
        setLoadingPdf(true);

        try {
            const tarjetasHtml = recomendacionesOrdenadas.map(item => `
                <div class="card">
                    <div class="card-header">
                        <div style="display: flex; align-items: center;">
                            <div class="orden-circle">${item.Orden}</div>
                            <span class="carrera-title">${item.Carrera}</span>
                        </div>
                        <span class="score-badge">${parseFloat(item.Puntaje).toFixed(1)} %</span>
                    </div>
                    <div class="obs-section">
                        <p class="obs-label">Afinidad detectada:</p>
                        <p class="obs-text">${item.Justificacion || "Sin justificación detallada."}</p>
                    </div>
                </div>
            `).join('');

            const htmlContent = `
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #2c3e50; background-color: #ffffff; }
                        
                        .header-container { display: flex; align-items: center; border-bottom: 3px solid #00e5ff; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { width: 100px; height: 100px; object-fit: contain; margin-right: 20px; }
                        .header-text { flex: 1; }
                        .header-text h1 { color: #160a2b; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px; }
                        .header-text p { color: #7f8c8d; margin: 5px 0 0 0; font-size: 14px; }

                        .profile-container { background: #f8f9fa; padding: 25px; border-radius: 12px; border-left: 5px solid #442484; margin-bottom: 30px; }
                        .profile-container h2 { margin: 0 0 10px 0; color: #442484; font-size: 20px; }
                        
                        .obs-label { font-size: 12px; font-weight: bold; color: #7f8c8d; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; }
                        .obs-text { font-size: 14px; color: #34495e; margin: 0; line-height: 1.6; text-align: justify; }

                        h3 { color: #160a2b; font-size: 22px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
                        
                        .card { border: 1px solid #e2e8f0; background-color: #ffffff; border-radius: 10px; margin-bottom: 20px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #eee; padding-bottom: 15px; margin-bottom: 15px; }
                        
                        .orden-circle { background-color: #442484; color: white; width: 28px; height: 28px; border-radius: 14px; display: flex; justify-content: center; align-items: center; font-weight: bold; margin-right: 15px; font-size: 14px;}
                        .carrera-title { color: #2c3e50; font-size: 18px; font-weight: bold; }
                        .score-badge { background-color: #00e5ff; color: #160a2b; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
                        
                        .obs-section { background-color: #fcfcfc; padding: 15px; border-radius: 8px; border: 1px solid #f0f0f0; }
                        
                        .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #bdc3c7; border-top: 1px solid #eee; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header-container">
                        <img src="https://fabkevin-003-site1.anytempurl.com/images/logoVocaIA.jpg" class="logo" />
                        <div class="header-text">
                            <h1>Reporte Vocacional</h1>
                            <p>Análisis de aptitudes generado automáticamente</p>
                        </div>
                    </div>

                    <div class="profile-container">
                        <h2>Estudiante: ${nombreEstudiante}</h2>
                        <p class="obs-label" style="margin-top: 15px;">Diagnóstico / Observación:</p>
                        <p class="obs-text">${ObservacionGeneralIA || "El modelo no generó observaciones específicas."}</p>
                    </div>

                    <h3>Carreras Sugeridas</h3>
                    ${tarjetasHtml}

                    <div class="footer">
                        <p>Documento oficial emitido por Orientación Vocacional App - ${new Date().toLocaleDateString()}</p>
                    </div>
                </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            await Sharing.shareAsync(uri, {
                UTI: '.pdf',
                mimeType: 'application/pdf',
                dialogTitle: 'Reporte Vocacional IA'
            });

            //showSuccessToast('Éxito', 'Reporte PDF generado correctamente');

        } catch (error) {
            console.error(error);
            showErrorToast('Error', 'No se pudo generar el documento PDF');
        } finally {
            setLoadingPdf(false);
        }
    };

    const finalizar = () => {
        // Regresa a la primera pantalla del Stack (Home)
        navigation.popToTop();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

            {/* --- SECCIÓN 1: OBSERVACIÓN GENERAL --- */}
            <View style={styles.generalCard}>
                <View style={styles.cardTitleContainer}>
                    <Ionicons name="analytics" size={24} color="#00e5ff" />
                    <Text style={styles.cardTitleText}>Diagnóstico de Inteligencia Artificial</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.generalText}>
                    {ObservacionGeneralIA}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Carreras de Mayor Afinidad</Text>

            {/* --- SECCIÓN 2: LISTA DE CARRERAS ORDENADAS --- */}
            {recomendacionesOrdenadas.map((item, index) => {
                // Color dinámico de la barra según el puntaje
                const puntaje = parseFloat(item.Puntaje);
                let colorProgress = "#00e5ff"; // Cian por defecto
                if (puntaje < 80) colorProgress = "#e866ff"; // Magenta para media
                if (puntaje < 60) colorProgress = "#ff4d4d"; // Rojo para baja

                return (
                    <View key={item.IdCarrera || index} style={styles.careerCard}>
                        <View style={styles.careerHeader}>
                            <View style={styles.ordenCircle}>
                                <Text style={styles.ordenText}>{item.Orden}</Text>
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
                            <Text style={styles.justificationTitle}><Ionicons name="bulb-outline" size={14} color="#8a98ac" />  ¿Por qué esta carrera?</Text>
                            <Text style={styles.justificationText}>
                                {item.Justificacion}
                            </Text>
                        </View>
                    </View>
                );
            })}

            {/* --- 3. SECCIÓN DE BOTONES --- */}
            <View style={styles.buttonsContainer}>
                
                {/* Botón Exportar PDF */}
                <View style={styles.buttonWrapper}>
                    <Button
                        title=" Exportar PDF"
                        onPress={generarPDF}
                        loading={loadingPdf}
                        icon={<Ionicons name="document-text" size={20} color="white" />}
                        buttonStyle={[styles.actionButton, { backgroundColor: '#d32f2f' }]} // Rojo clásico PDF
                        titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
                    />
                </View>

                {/* Botón Finalizar */}
                <View style={styles.buttonWrapper}>
                    <Button
                        title=" Finalizar"
                        onPress={finalizar}
                        icon={<Ionicons name="checkmark-circle" size={20} color="#160a2b" />}
                        buttonStyle={[styles.actionButton, { backgroundColor: '#00e5ff' }]} // Botón principal Cian
                        titleStyle={{ fontSize: 14, fontWeight: 'bold', color: '#160a2b' }}
                    />
                </View>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
        paddingTop: 15,
    },
    containerCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#050505',
    },
    noDataText: {
        color: '#8a98ac',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 15,
        marginBottom: 15,
        color: '#e866ff', // Magenta neón
        letterSpacing: 0.5
    },
    // Estilos Card Observación
    generalCard: {
        backgroundColor: '#0d0f12',
        borderRadius: 15,
        padding: 20,
        marginBottom: 10,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)', // Borde cian más marcado
        shadowColor: '#00e5ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    cardTitleText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 15
    },
    generalText: {
        fontSize: 14,
        color: '#8a98ac',
        lineHeight: 22,
        textAlign: 'justify',
    },
    // Estilos Card Carreras
    careerCard: {
        backgroundColor: '#0d0f12',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    careerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ordenCircle: {
        backgroundColor: '#442484',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    ordenText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14
    },
    careerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        flex: 1, 
        marginRight: 10,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    scoreLabel: {
        fontSize: 12,
        color: '#8a98ac',
    },
    justificationBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: 12,
        borderRadius: 10,
        marginTop: 5
    },
    justificationTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#8a98ac',
        marginBottom: 4
    },
    justificationText: {
        fontSize: 13,
        color: '#d1d5db',
        lineHeight: 20,
        textAlign: 'justify'
    },
    // --- ESTILOS DE BOTONES ---
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginVertical: 20,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#0d0f12', // Trick para evitar esquinas blancas
    },
    actionButton: {
        borderRadius: 10,
        paddingVertical: 14,
    }
});