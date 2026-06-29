import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import { Overlay } from '@rneui/themed';

export default function LoadingIA({ isVisible, onCountdownComplete }) {
    const [contador, setContador] = useState(3);
    const [fadeAnim] = useState(new Animated.Value(1)); // Para efecto de parpadeo

    useEffect(() => {
        let interval;
        
        // Si el Overlay se hace visible, reiniciamos el contador a 3
        if (isVisible) {
            setContador(3);
            
            // Animación de pulso para la imagen
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, { toValue: 0.5, duration: 500, useNativeDriver: true }),
                    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
                ])
            ).start();

            // Intervalo de cuenta regresiva
            interval = setInterval(() => {
                setContador((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        
                        // CORRECCIÓN: Usamos setTimeout de 0ms para sacar la llamada 
                        // de la actualización de estado del render actual.
                        if(onCountdownComplete) {
                            setTimeout(() => onCountdownComplete(), 0); 
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            // Si se oculta, detenemos la animación y limpiamos el intervalo
            fadeAnim.setValue(1);
            if(interval) clearInterval(interval);
        }

        return () => {
            if(interval) clearInterval(interval);
        };
    }, [isVisible]);

    return (
        <Overlay
            isVisible={isVisible}
            backdropStyle={styles.backdrop}
            overlayStyle={styles.overlay}
            // Evitamos que el usuario lo cierre tocando afuera mientras cuenta
            onBackdropPress={() => {}} 
        >
            <View style={styles.view}>
                {/* Imagen con animación de pulso */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Image 
                        source={{ uri: 'https://fabkevin-003-site1.anytempurl.com/images/logovila.jpg' }} 
                        style={styles.image}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Text style={styles.textMain}>Calibrando IA...</Text>
                
                <View style={styles.counterContainer}>
                    <Text style={styles.textCounter}>Generando en: <Text style={styles.number}>{contador}</Text></Text>
                </View>
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.85)", // Fondo muy oscuro para inmersión
    },
    overlay: {
        backgroundColor: "transparent", // Quitamos el fondo blanco de la tarjeta
        borderWidth: 0,
        elevation: 0, 
        shadowOpacity: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    view: {
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 30,
        borderWidth: 3,
        borderColor: '#00e5ff',
    },
    textMain: {
        color: "#00e5ff",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: 2,
        marginBottom: 10,
        textShadowColor: 'rgba(0, 229, 255, 0.5)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10
    },
    counterContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 10
    },
    textCounter: {
        color: "#ffffff",
        fontSize: 16,
        letterSpacing: 1,
    },
    number: {
        color: "#FFD700", // Amarillo/Dorado para resaltar el número
        fontSize: 20,
        fontWeight: "bold"
    }
});