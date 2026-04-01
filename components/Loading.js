import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Overlay } from '@rneui/themed';

export default function Loading({ isVisible, text }) {
    return (
        <Overlay
            isVisible={isVisible}
            // Propiedad actualizada para oscurecer el fondo en RNEUI moderno
            backdropStyle={styles.backdrop} 
            overlayStyle={styles.overlay}
        >
            <View style={styles.view}>
                {/* Usamos el color cian neón para el spinner */}
                <ActivityIndicator
                    size="large"
                    color="#00e5ff" 
                />
                {
                    text && <Text style={styles.text}>{text}</Text>
                }
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Un fondo un poco más oscuro para que resalte el neón
    },
    overlay: {
        // En lugar de width/height fijos, usamos "min" y padding para que se adapte al texto
        minHeight: 120,
        minWidth: 220,
        padding: 20,
        backgroundColor: "#0d0f12", // Mismo fondo oscuro de tus tarjetas
        borderColor: "rgba(0, 229, 255, 0.5)", // Borde cian semitransparente
        borderWidth: 1,
        borderRadius: 15,
        // Sombra estilo Neón compatible con Android (elevation)
        shadowColor: "#00e5ff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10, 
    },
    view: {
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "#ffffff",
        marginTop: 15,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: 1, // Le da un toque más tecnológico a la fuente
    }
});