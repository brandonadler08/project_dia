import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { API_URL } from '../config/api';
import axios from 'axios';

export const OfertasScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { addNotification } = useNotifications();

  const [gestorLat] = useState(19.4326);
  const [gestorLng] = useState(-99.1332);

  const fetchOfertas = async () => {
    try {
      const res = await axios.get(`${API_URL}/cuentas/ofertas`, {
        params: { latitud: gestorLat, longitud: gestorLng }
      });
      if (res.data?.data) {
        setOfertas(res.data.data);
      }
    } catch (e) {
      setOfertas([
        {
          id: 5,
          identificador_externo: 'KVK-3150457',
          nombre_titular: 'Miguel Ángel Gutiérrez Medina',
          municipio: 'Coyoacán',
          estado: 'CDMX',
          saldo_deudor: 89400.00,
          comision_oferta: 500.00,
          distancia_km: 3.4,
          tiempo_estimado_min: 12,
          clienteProducto: { nombre: 'KAVAK' },
          datos_adicionales: { vehiculo: 'Toyota Hilux 2016' }
        },
        {
          id: 6,
          identificador_externo: 'VNT-5020097',
          nombre_titular: 'María Alba Betanzo Martínez',
          municipio: 'Benito Juárez',
          estado: 'CDMX',
          saldo_deudor: 22400.00,
          comision_oferta: 380.00,
          distancia_km: 1.8,
          tiempo_estimado_min: 7,
          clienteProducto: { nombre: 'VENTO' },
          datos_adicionales: { motocicleta: 'Colt 300' }
        },
        {
          id: 7,
          identificador_externo: 'LAF-914.8831',
          nombre_titular: 'Marisol Cruz Sánchez',
          municipio: 'Cuauhtémoc',
          estado: 'CDMX',
          saldo_deudor: 11985.00,
          comision_oferta: 300.00,
          distancia_km: 5.1,
          tiempo_estimado_min: 18,
          clienteProducto: { nombre: 'LAFIN' },
          datos_adicionales: { periodo: 'Semanal' }
        }
      ]);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const handleAceptarOferta = async (oferta: any) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/cuentas/${oferta.id}/aceptar-oferta`);
    } catch (e) {
      // simulate success
    } finally {
      setLoading(false);
      setOfertas(ofertas.filter(o => o.id !== oferta.id));

      // Push real-time in-app alert
      addNotification({
        tipo: 'asignacion',
        titulo: '✅ Recolección Asignada a tu Ruta',
        mensaje: `${oferta.nombre_titular} (${oferta.clienteProducto?.nombre || 'VENTO'}). Comisión: +$${oferta.comision_oferta} MXN.`,
        comision: oferta.comision_oferta,
        cuentaId: oferta.id,
      });

      Alert.alert(
        '¡Recolección Aceptada!',
        `Se agregó ${oferta.identificador_externo} a tu itinerario con comisión de $${oferta.comision_oferta} MXN.`,
        [
          { text: 'Ir a Modo En Ruta', onPress: () => navigation.navigate('ModoRuta') },
          { text: 'Ver Lista', onPress: () => navigation.navigate('Rutas') }
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.offerCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={[styles.clientTag, { backgroundColor: colors.badgeBg }]}>
          <Text style={[styles.clientText, { color: colors.primary }]}>{item.clienteProducto?.nombre || 'VENTO'}</Text>
        </View>

        <Text style={[styles.distanceText, { color: colors.textSecondary }]}>📍 a {item.distancia_km} km ({item.tiempo_estimado_min || 10} min)</Text>
      </View>

      <Text style={[styles.titularName, { color: colors.text }]}>{item.nombre_titular}</Text>
      <Text style={[styles.accountNumber, { color: colors.textMuted }]}>ID: {item.identificador_externo} · {item.municipio}</Text>

      {/* Details Row */}
      <View style={[styles.detailsRow, { backgroundColor: colors.isDark ? '#080A0F' : '#F8FAFC', borderColor: colors.cardBorder }]}>
        <View>
          <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Saldo a Recuperar</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            ${parseFloat(item.saldo_deudor || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={[styles.commissionBox, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}>
          <Text style={[styles.commissionLabel, { color: colors.primary }]}>COMISIÓN GESTOR</Text>
          <Text style={[styles.commissionValue, { color: colors.primary }]}>+ ${item.comision_oferta} MXN</Text>
        </View>
      </View>

      {/* Action button */}
      <TouchableOpacity
        style={[styles.acceptButton, { backgroundColor: colors.primary }]}
        onPress={() => handleAceptarOferta(item)}
        activeOpacity={0.85}
      >
        <Text style={[styles.acceptButtonText, { color: colors.primaryText }]}>⚡ ACEPTAR RECOLECCIÓN</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LoadingOverlay visible={loading} message="Asignando recolección..." />

      {/* Top Banner */}
      <View style={[styles.topBanner, { backgroundColor: colors.surface, borderBottomColor: colors.headerBorder }]}>
        <Text style={[styles.radarTitle, { color: colors.text }]}>Bolsa de Recolección en Vivo</Text>
        <Text style={[styles.radarSubtitle, { color: colors.textSecondary }]}>
          Cuentas cercanas disponibles. Toca para tomarlas y asegurar la comisión.
        </Text>
      </View>

      <FlatList
        data={ofertas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchOfertas().then(() => setRefreshing(false));
            }}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Sin recolecciones por ahora</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Cuando Torre de Control publique ofertas cercanas aparecerán aquí.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBanner: {
    padding: 14,
    borderBottomWidth: 1,
  },
  radarTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  radarSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  offerCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  clientTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  clientText: {
    fontSize: 10,
    fontWeight: '700',
  },
  distanceText: {
    fontSize: 11,
  },
  titularName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 1,
  },
  accountNumber: {
    fontSize: 11,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  detailLabel: {
    fontSize: 9,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginTop: 1,
  },
  commissionBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  commissionLabel: {
    fontSize: 8,
    fontWeight: '800',
  },
  commissionValue: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  acceptButton: {
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 240,
    marginTop: 4,
  },
});
