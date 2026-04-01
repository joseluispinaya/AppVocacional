import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Overlay } from '@rneui/themed';

export default function Modal({ isVisible, setVisible, children }) {
    return (
        <Overlay
            isVisible={isVisible}
            backdropStyle={styles.backdrop}
            overlayStyle={styles.overlay}
            onBackdropPress={() => setVisible(false)}
            animationType="fade"
        >
            <View style={styles.content}>
                {children}
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo trasero bien oscuro
    },
    overlay: {
        width: "90%",
        backgroundColor: "#0d0f12", // Tarjeta oscura
        padding: 0, // Quitamos padding para controlarlo desde adentro
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.4)', // Borde neón
        shadowColor: '#00e5ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    content: {
        padding: 25,
    }
});