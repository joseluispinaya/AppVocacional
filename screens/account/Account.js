import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Avatar, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';

import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import CambiarPasswordForm from '../../components/account/CambiarPasswordForm';

const BASE_URL = 'http://joseluis1989-008-site2.ltempurl.com';
const defaultAvatarUri = Asset.fromModule(require('../../assets/no-image.png')).uri;

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  // Lógica para la foto protegida (igual que en Home)
  const tieneFoto = user?.Photo && user.Photo.trim() !== "";
  const avatarSource = tieneFoto
    ? { uri: `${BASE_URL}${user.Photo.trim()}` }
    : { uri: defaultAvatarUri };

  const confirmarCierreSesion = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, salir", onPress: async () => await logout(), style: "destructive" }
      ]
    );
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* --- CABECERA DE PERFIL --- */}
      <View style={styles.profileHeader}>
        <Avatar
          size={100}
          rounded
          source={avatarSource}
          containerStyle={styles.avatarBorder}
          // avatarStyle={{ backgroundColor: '#1a1d24', resizeMode: 'cover' }}
        />
        <Text style={styles.userName}>{user.Nombres} {user.Apellidos}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Estudiante Activo</Text>
        </View>
      </View>

      {/* --- DATOS DEL ESTUDIANTE --- */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Información Personal</Text>

        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="mail" size={20} color="#00e5ff" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValue}>{user.Correo}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="card" size={20} color="#e866ff" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Carnet de Identidad (CI)</Text>
            <Text style={styles.infoValue}>{user.NroCi}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="business" size={20} color="#442484" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Unidad Educativa</Text>
            <Text style={styles.infoValue}>{user.NombreUndEd}</Text>
          </View>
        </View>
      </View>

      {/* --- SECCIÓN DE AJUSTES --- */}
      <Text style={styles.sectionTitle}>Ajustes de Seguridad</Text>

      <Button
        title=" Cambiar Contraseña"
        icon={<Ionicons name="key-outline" size={22} color="#ffffff" />}
        onPress={() => setShowModal(true)} // ABRIMOS EL MODAL
        buttonStyle={styles.actionButton}
        containerStyle={styles.buttonWrapper}
        titleStyle={styles.buttonText}
      />

      <Button
        title=" Cerrar Sesión"
        icon={<Ionicons name="log-out-outline" size={22} color="#ff4d4d" />}
        onPress={confirmarCierreSesion}
        buttonStyle={styles.logoutButton}
        containerStyle={styles.buttonWrapper}
        titleStyle={[styles.buttonText, { color: '#ff4d4d' }]}
      />

      {/* --- INVOCAMOS NUESTRO MODAL --- */}
      <Modal isVisible={showModal} setVisible={setShowModal}>
        <CambiarPasswordForm setShowModal={setShowModal} />
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarBorder: {
    borderWidth: 3,
    borderColor: '#00e5ff',
    padding: 3,
    marginBottom: 15,
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  badgeContainer: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  badgeText: {
    color: '#00e5ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#0d0f12',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoTitle: {
    color: '#8a98ac',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#8a98ac',
    fontSize: 12,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionTitle: {
    color: '#8a98ac',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonWrapper: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionButton: {
    backgroundColor: '#442484',
    paddingVertical: 14,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)', // Fondo rojo translúcido
    paddingVertical: 14,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.3)',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  }
});