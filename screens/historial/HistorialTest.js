import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Loading from '../../components/Loading';
import { AuthContext } from '../../context/AuthContext';

const API_URL = 'https://fabkevin-003-site1.anytempurl.com/api';

export default function HistorialTest() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  // FUNCIÓN: Hacer la solicitud al backend SOLO cuando el usuario presiona el botón
  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/historiales/historial/${user.IdEstudiante}`);
      const data = await response.json();

      if (data.Estado) {
        setHistorial(data.Data);
      } else {
        Alert.alert("Aviso", data.Mensaje || "No se encontraron historiales.");
        setHistorial([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error de Conexión", "No se pudo contactar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // RENDER: Diseño de cada tarjeta del FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.historyCard}
      // Navegamos pasando el IdTest y la Fecha para el título
      onPress={() => navigation.navigate('detalle-screen', { idTest: item.IdTest, fecha: item.FechaTest })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={14} color="#00e5ff" style={{ marginRight: 5 }} />
          <Text style={styles.dateText}>{item.FechaTest}</Text>
        </View>
        <Ionicons name="chevron-forward-circle" size={24} color="#e866ff" />
      </View>

      <Text style={styles.obsTitle}>Diagnóstico:</Text>
      {/* numberOfLines={2} corta el texto si es muy largo y pone "..." */}
      <Text style={styles.obsText} numberOfLines={2}>
        {item.ObservacionGeneralIA}
      </Text>
    </TouchableOpacity>
  );

  if (!user) return <Loading isVisible={true} text="Cargando perfil..." />;

  return (
    <View style={styles.container}>

      {/* CABECERA (ESTILO NEÓN) */}
      <View style={styles.headerCard}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="time" size={28} color="#00e5ff" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.headerTitleText}>Tus Evaluaciones</Text>
            <Text style={styles.headerSubtitle}>Consulta los resultados de tus test anteriores.</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.buttonsRow}>
          <Button
            title=" Cargar Historial"
            onPress={cargarHistorial}
            icon={<Ionicons name="cloud-download-outline" size={20} color="white" />}
            titleStyle={{ fontWeight: 'bold', fontSize: 14 }}
            buttonStyle={styles.actionButton}
            containerStyle={styles.buttonContainer}
          />
        </View>
      </View>

      {/* LISTA DE HISTORIAL */}
      {historial.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={60} color="#1a1d24" />
          <Text style={styles.emptyText}>Presiona el botón para ver tu historial</Text>
        </View>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.IdTest.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Loading isVisible={loading} text="Buscando registros..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505", paddingTop: 15 },
  headerCard: {
    backgroundColor: '#0d0f12',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { backgroundColor: 'rgba(0, 229, 255, 0.1)', padding: 10, borderRadius: 20 },
  headerTitleText: { fontSize: 18, fontWeight: "bold", color: '#ffffff' },
  headerSubtitle: { fontSize: 13, color: '#8a98ac', marginTop: 3 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 15 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'center' },
  buttonContainer: { flex: 1, borderRadius: 10, backgroundColor: '#0d0f12' },
  actionButton: { backgroundColor: '#442484', borderRadius: 10, paddingVertical: 12 },

  // Estilos FlatList
  historyCard: {
    backgroundColor: '#0d0f12',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dateBadge: { flexDirection: 'row', backgroundColor: 'rgba(0, 229, 255, 0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.3)' },
  dateText: { color: '#00e5ff', fontWeight: 'bold', fontSize: 12 },
  obsTitle: { fontSize: 12, color: '#8a98ac', fontWeight: 'bold', marginBottom: 4 },
  obsText: { fontSize: 14, color: '#d1d5db', lineHeight: 20 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#444', marginTop: 10, fontSize: 14 }
});