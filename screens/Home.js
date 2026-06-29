import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Avatar, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
// IMPORTANTE: Importamos el contexto para acceder a la función logout
import { AuthContext } from '../context/AuthContext';

// URL base para concatenar las imágenes
import { BASE_URL } from '../utils/apiConfig';


// 2. EXTRAEMOS LA URI LOCAL DE LA IMAGEN POR DEFECTO
const defaultAvatarUri = Asset.fromModule(require('../assets/no-image.png')).uri;


export default function Home() {
  const navigation = useNavigation();
  // Consumimos la función logout del estado global
  // Consumimos el usuario y la función logout
  const { user } = useContext(AuthContext);

  // 2. LÓGICA BLINDADA
  // Verificamos que 'Photo' exista Y que, al quitarle los espacios, no esté vacío.
  const tieneFoto = user?.Photo && user.Photo.trim() !== "";

  // 1. LÓGICA DE LA FOTO DE PERFIL
  // Si el usuario tiene foto en BD, concatenamos. Si no, usamos la imagen local por defecto.
  const avatarSource = tieneFoto
    ? { uri: `${BASE_URL}${user.Photo.trim()}` }
    : { uri: defaultAvatarUri }; // ¡Magia! Ahora ambos lados son un objeto con 'uri'

  //console.log(avatarSource);

  // Si por alguna razón el usuario aún no carga, evitamos errores
  if (!user) return null;

  return (
    // Reemplazamos SafeAreaView por un View normal
    <View style={styles.mainContainer}>
      {/* showsVerticalScrollIndicator={false} oculta la barra fea de scroll a la derecha */}
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ==========================================
            1. HEADER: Saludo y Avatar Dinámico
        ========================================== */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            {/* Mostramos solo el primer nombre, o puedes usar user.FullName */}
            <Text style={styles.greeting}>Hola, {user.Nombres} 👋</Text>
            {/* Mostramos el colegio al que pertenece como detalle extra */}
            <Text style={styles.subtitle}>{user.NombreUndEd}</Text>
          </View>

          <Avatar
            size={56}
            rounded
            source={avatarSource}
            containerStyle={styles.avatarBorder}
          />
        </View>

        {/* ==========================================
            2. HERO CARD: Imagen, Título y Botón Principal
        ========================================== */}
        <View style={styles.heroCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://fabkevin-003-site1.anytempurl.com/images/logovila.jpg' }} 
              // source={require('../assets/logodefault.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heroTitle}>Orientación Vocacional IA</Text>
          <Text style={styles.heroText}>
            Nuestra inteligencia artificial analizará tus aptitudes y te recomendará las mejores carreras para tu perfil.
          </Text>

          <Button
            title=" COMENZAR TEST"
            icon={<Ionicons name="rocket-outline" size={22} color="#ffffff" />}
            buttonStyle={styles.primaryButton}
            containerStyle={styles.buttonContainer}
            titleStyle={{ fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}
            // LA SOLUCIÓN: Navegamos directamente al nombre del Tab
            onPress={() => navigation.navigate('test-model')}
          />
        </View>

        {/* ==========================================
            3. ACCIONES SECUNDARIAS
        ========================================== */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('historia')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 229, 255, 0.1)' }]}>
              <Ionicons name="time" size={32} color="#00e5ff" />
            </View>
            <Text style={styles.actionText}>Mi Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('account')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(232, 102, 255, 0.1)' }]}>
              <Ionicons name="person" size={32} color="#e866ff" />
            </View>
            <Text style={styles.actionText}>Perfil</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#050505',
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
    color: '#00e5ff', // Lo puse en cian para que resalte el nombre del colegio
    marginTop: 4,
  },
  avatarBorder: {
    borderWidth: 2,
    borderColor: '#00e5ff',
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
    backgroundColor: '#000000',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#e866ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
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
    color: '#a17dc3',
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
    backgroundColor: '#442484',
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