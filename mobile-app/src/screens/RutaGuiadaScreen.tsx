import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const RutaGuiadaScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rutaOptimizada] = useState([
    {
      id: 1,
      identificador_externo: 'KVK-2918093',
      nombre_titular: 'Marco Antonio Salazar Rodríguez',
      cliente: 'KAVAK',
      direccion: 'Calle Pípila 203, Col. Roma Sur, Cuauhtémoc, CDMX',
      telefono: '5541928374',
      saldo: 43481.50,
      mora: 64,
      distancia_km: 2.1,
      tiempo_min: 8,
      lat: 19.4085,
      lng: -99.1628,
      comision: 400,
      notas: 'Vehículo Nissan Frontier 2024. Requiere video.',
      completada: false,
    },
    {
      id: 3,
      identificador_externo: 'CLP-12bd2c09',
      nombre_titular: 'Axel Joaquín Osorio Peña (B Mine Bar)',
      cliente: 'CLIP',
      direccion: 'Calle Sonora 140, Col. Condesa, Cuauhtémoc, CDMX',
      telefono: '5589123049',
      saldo: 62978.50,
      mora: 38,
      distancia_km: 3.2,
      tiempo_min: 11,
      lat: 19.4140,
      lng: -99.1720,
      comision: 300,
      notas: 'Préstamo Clip terminal POS.',
      completada: false,
    },
    {
      id: 2,
      identificador_externo: 'VNT-5075881',
      nombre_titular: 'José Antonio Solís Sánchez',
      cliente: 'VENTO',
      direccion: 'Av. Coyoacán 820, Col. Del Valle, Benito Juárez, CDMX',
      telefono: '5538920192',
      saldo: 17508.00,
      mora: 45,
      distancia_km: 4.8,
      tiempo_min: 16,
      lat: 19.3824,
      lng: -99.1698,
      comision: 350,
      notas: 'Motocicleta Falkon 250CC.',
      completada: false,
    },
    {
      id: 4,
      identificador_externo: 'KNF-237000',
      nombre_titular: 'Sergio Pablo Castañeda Anaya',
      cliente: 'KONFÍO',
      direccion: 'Av. Revolución 520, Col. San Pedro de los Pinos, CDMX',
      telefono: '5544999961',
      saldo: 604951.74,
      mora: 42,
      distancia_km: 6.4,
      tiempo_min: 22,
      lat: 19.3905,
      lng: -99.1860,
      comision: 550,
      notas: 'PyME Transport Logistic. Ofrecer One Shot 50%.',
      completada: false,
    }
  ]);

  const currentStop = rutaOptimizada[currentIndex] || rutaOptimizada[0];
  const totalParadas = rutaOptimizada.length;
  const completadas = rutaOptimizada.filter(r => r.completada).length;

  const abrirGPS = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${currentStop.lat},${currentStop.lng}`;
    Linking.openURL(url);
  };

  const llamar = () => {
    Linking.openURL(`tel:${currentStop.telefono}`);
  };

  const whatsapp = () => {
    const msg = `Hola estimado(a) ${currentStop.nombre_titular}, soy tu gestor de EAD BPO asignado a tu cuenta de ${currentStop.cliente}.`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}&phone=52${currentStop.telefono}`);
  };

  const reoptimizarRuta = () => {
    Alert.alert('⚡ Ruta Optimizada', 'Se recalculó el orden de paradas por menor distancia GPS en tiempo real. Ahorro estimado: 22 minutos.');
  };

  const registrarVisitaActual = () => {
    navigation.navigate('NuevaGestion', {
      cuenta: {
        id: currentStop.id,
        identificador_externo: currentStop.identificador_externo,
        nombre_titular: currentStop.nombre_titular,
        clienteProducto: { nombre: currentStop.cliente },
        saldo_deudor: currentStop.saldo,
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Progress Bar */}
        <View style={[styles.topSummaryCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryTitle, { color: colors.primary }]}>MODO EN RUTA ACTIVO</Text>
            <TouchableOpacity onPress={reoptimizarRuta}>
              <Text style={styles.reoptBtn}>⚡ Re-optimizar</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.summaryStats, { color: colors.textSecondary }]}>
            Parada {currentIndex + 1} de {totalParadas} · {completadas} completadas · ~57 min restantes
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.badgeBg }]}>
            <View style={[styles.progressFill, { width: `${((currentIndex) / totalParadas) * 100}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>

        {/* Big Current Stop Action Card */}
        <View style={[styles.mainStopCard, { backgroundColor: colors.surface, borderColor: colors.goldBorder }]}>
          <View style={styles.stopHeader}>
            <View style={[styles.stopBadge, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}>
              <Text style={[styles.stopBadgeText, { color: colors.primary }]}>PARADA ACTUAL #{currentIndex + 1}</Text>
            </View>
            <Text style={[styles.clientTag, { color: colors.textSecondary }]}>{currentStop.cliente}</Text>
          </View>

          <Text style={[styles.titularName, { color: colors.text }]}>{currentStop.nombre_titular}</Text>
          <Text style={[styles.accountNumber, { color: colors.textMuted }]}>ID: {currentStop.identificador_externo}</Text>

          <View style={[styles.addressBox, { backgroundColor: colors.isDark ? '#080A0F' : '#F8FAFC', borderColor: colors.cardBorder }]}>
            <Text style={[styles.addressLabel, { color: colors.textMuted }]}>📍 Dirección de Visita</Text>
            <Text style={[styles.addressText, { color: colors.text }]}>{currentStop.direccion}</Text>
          </View>

          {/* Metrics row */}
          <View style={[styles.metricsRow, { backgroundColor: colors.isDark ? '#080A0F' : '#F8FAFC', borderColor: colors.cardBorder }]}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>DISTANCIA</Text>
              <Text style={[styles.metricVal, { color: colors.text }]}>📍 {currentStop.distancia_km} km</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>TIEMPO APROX.</Text>
              <Text style={[styles.metricVal, { color: colors.text }]}>⏱️ {currentStop.tiempo_min} min</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>COMISIÓN</Text>
              <Text style={[styles.metricVal, { color: colors.primary }]}>+ ${currentStop.comision}</Text>
            </View>
          </View>

          {/* Big Navigation Buttons */}
          <TouchableOpacity style={styles.bigNavBtn} onPress={abrirGPS} activeOpacity={0.85}>
            <Text style={styles.bigNavBtnText}>🗺️ INICIAR RUTA EN GPS (MAPS / WAZE)</Text>
          </TouchableOpacity>

          <View style={styles.quickContactRow}>
            <TouchableOpacity style={[styles.contactBtnCall, { backgroundColor: '#2563EB' }]} onPress={llamar}>
              <Text style={styles.contactBtnText}>📞 Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.contactBtnWa, { backgroundColor: '#059669' }]} onPress={whatsapp}>
              <Text style={styles.contactBtnText}>💬 WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.checkinBtn, { backgroundColor: colors.primary }]} 
            onPress={registrarVisitaActual} 
            activeOpacity={0.85}
          >
            <Text style={[styles.checkinBtnText, { color: colors.primaryText }]}>📸 REGISTRAR LLEGADA Y GESTIÓN (GPS)</Text>
          </TouchableOpacity>
        </View>

        {/* Stepper Navigation */}
        <View style={styles.stepControls}>
          <TouchableOpacity
            style={[
              styles.stepBtn, 
              { backgroundColor: colors.surface, borderColor: colors.cardBorder },
              currentIndex === 0 && styles.stepBtnDisabled
            ]}
            disabled={currentIndex === 0}
            onPress={() => setCurrentIndex(currentIndex - 1)}
          >
            <Text style={[styles.stepBtnText, { color: colors.text }]}>← Parada Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepBtn, 
              { backgroundColor: colors.surface, borderColor: colors.cardBorder },
              currentIndex === totalParadas - 1 && styles.stepBtnDisabled
            ]}
            disabled={currentIndex === totalParadas - 1}
            onPress={() => setCurrentIndex(currentIndex + 1)}
          >
            <Text style={[styles.stepBtnText, { color: colors.text }]}>Siguiente Parada →</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Stops Itinerary */}
        <View style={[styles.itineraryCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Text style={[styles.itineraryTitle, { color: colors.text }]}>📋 Itinerario de Hoy ({totalParadas} paradas)</Text>
          {rutaOptimizada.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itineraryRow, 
                { borderBottomColor: colors.cardBorder },
                idx === currentIndex && { backgroundColor: colors.badgeBg, borderRadius: 8 }
              ]}
              onPress={() => setCurrentIndex(idx)}
            >
              <Text style={[styles.itineraryIndex, { color: idx === currentIndex ? colors.primary : colors.textMuted }]}>
                #{idx + 1}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itineraryName, { color: colors.text }]} numberOfLines={1}>{item.nombre_titular}</Text>
                <Text style={[styles.itinerarySub, { color: colors.textSecondary }]}>{item.cliente} · a {item.distancia_km} km</Text>
              </View>
              <Text style={[styles.itineraryStatus, { color: idx === currentIndex ? colors.primary : colors.textSecondary }]}>
                {idx === currentIndex ? '▶ En curso' : idx < currentIndex ? '✓ Lista' : 'Pendiente'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  topSummaryCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  reoptBtn: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '700',
  },
  summaryStats: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  mainStopCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stopBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stopBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  clientTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  titularName: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
  },
  accountNumber: {
    fontSize: 11,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  addressBox: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  addressLabel: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  metricCol: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  bigNavBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  bigNavBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickContactRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  contactBtnCall: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactBtnWa: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkinBtn: {
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkinBtnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stepControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  stepBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.3,
  },
  stepBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itineraryCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  itineraryTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  itineraryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
    paddingHorizontal: 6,
  },
  itineraryIndex: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 22,
  },
  itineraryName: {
    fontSize: 12,
    fontWeight: '700',
  },
  itinerarySub: {
    fontSize: 10,
  },
  itineraryStatus: {
    fontSize: 10,
    fontWeight: '600',
  },
});
