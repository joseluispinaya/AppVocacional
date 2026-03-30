import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Avatar, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* ==========================================
            1. HEADER: Saludo y Avatar del Usuario
        ========================================== */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Hola, Estudiante 👋</Text>
            <Text style={styles.subtitle}>¿Listo para descubrir tu futuro?</Text>
          </View>
          
          <Avatar
            size={56}
            rounded
            // Aquí luego puedes poner la foto real del usuario o iniciales
            source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
            containerStyle={styles.avatarBorder}
          />
        </View>

        {/* ==========================================
            2. HERO CARD: Imagen, Título y Botón Principal
        ========================================== */}
        <View style={styles.heroCard}>
          <View style={styles.imageContainer}>
            {/* Asegúrate de que la ruta coincida con la ubicación de tu carpeta assets */}
            <Image
              source={require('../assets/logodefault.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heroTitle}>Orientación Vocacional IA</Text>
          <Text style={styles.heroText}>
            Nuestra inteligencia artificial analizará tus aptitudes y te recomendará las mejores carreras para tu perfil.
          </Text>

          <Button
            title=" COMENZAR TEST VOCACIONAL"
            icon={<Ionicons name="rocket-outline" size={22} color="#ffffff" />}
            buttonStyle={styles.primaryButton}
            containerStyle={styles.buttonContainer}
            titleStyle={{ fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}
            onPress={() => console.log('Navegar al Test')}
          />
        </View>

        {/* ==========================================
            3. ACCIONES SECUNDARIAS: Historial y Perfil
        ========================================== */}
        <View style={styles.actionsGrid}>
          {/* Tarjeta de Historial */}
          <TouchableOpacity 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => console.log('Navegar al Historial')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 229, 255, 0.1)' }]}>
              <Ionicons name="time" size={32} color="#00e5ff" />
            </View>
            <Text style={styles.actionText}>Mi Historial</Text>
          </TouchableOpacity>

          {/* Tarjeta de Catálogo de Carreras */}
          <TouchableOpacity 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => console.log('Navegar a Carreras')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(232, 102, 255, 0.1)' }]}>
              <Ionicons name="school" size={32} color="#e866ff" />
            </View>
            <Text style={styles.actionText}>Carreras</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050505', // Fondo oscuro profundo
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  /* --- Header --- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#8a98ac',
    marginTop: 4,
  },
  avatarBorder: {
    borderWidth: 2,
    borderColor: '#00e5ff', // Borde cian neón para el avatar
    padding: 2,
  },
  /* --- Hero Card --- */
  heroCard: {
    backgroundColor: '#0d0f12',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    // Sombra neón suave
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  imageContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#000000', // Funde los bordes del logo
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Efecto de resplandor detrás del logo
    shadowColor: '#e866ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  heroImage: {
    width: 130,
    height: 130,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroText: {
    fontSize: 14,
    color: '#a17dc3', // Un tono violeta suave para el texto
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: '#442484', // Violeta intenso de tu paleta
    paddingVertical: 15,
  },
  /* --- Actions Grid --- */
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#0d0f12',
    width: '48%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});