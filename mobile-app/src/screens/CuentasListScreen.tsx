import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  Linking, 
  RefreshControl 
} from 'react-native';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { API_URL } from '../config/api';

export const CuentasListScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [cuentas, setCuentas] = useState<any[]>([]);
  const [siguienteParada, setSiguienteParada] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('TODOS');

  const [gestorLat] = useState(19.4326);
  const [gestorLng] = useState(-99.1332);

  const fetchRutas = async () => {
    try {
      const res = await axios.post(`${API_URL}/cuentas/calcular-rutas`, {
        latitud: gestorLat,
        longitud: gestorLng,
        comisionista_id: 1,
      });

      if (res.data?.data) {
        setCuentas(res.data.data.cuentas_ordenadas || []);
        setSiguienteParada(res.data.data.siguiente_parada || null);
      }
    } catch (e) {
      const mockRoute = [
        {
          id: 1,
          identificador_externo: 'KVK-2918093',
          nombre_titular: 'Marco Antonio Salazar Rodríguez',
          direccion_completa: 'Calle Pípila 203, Col. Roma Sur, Cuauhtémoc, CDMX',
          municipio: 'Cuauhtémoc',
          dias_mora: 64,
          saldo_deudor: 43481.50,
          distancia_km: 2.1,
          tiempo_estimado_min: 8,
          clienteProducto: { nombre: 'KAVAK' },
          latitud: 19.4085,
          longitud: -99.1628,
        },
        {
          id: 3,
          identificador_externo: 'CLP-12bd2c09',
          nombre_titular: 'Axel Joaquín Osorio Peña (B Mine Bar)',
          direccion_completa: 'Calle Sonora 140, Col. Condesa, Cuauhtémoc, CDMX',
          municipio: 'Cuauhtémoc',
          dias_mora: 38,
          saldo_deudor: 62978.50,
          distancia_km: 3.2,
          tiempo_estimado_min: 11,
          clienteProducto: { nombre: 'CLIP' },
          latitud: 19.4140,
          longitud: -99.1720,
        },
        {
          id: 2,
          identificador_externo: 'VNT-5075881',
          nombre_titular: 'José Antonio Solís Sánchez',
          direccion_completa: 'Av. Coyoacán 820, Col. Del Valle, Benito Juárez, CDMX',
          municipio: 'Benito Juárez',
          dias_mora: 45,
          saldo_deudor: 17508.00,
          distancia_km: 4.8,
          tiempo_estimado_min: 16,
          clienteProducto: { nombre: 'VENTO' },
          latitud: 19.3824,
          longitud: -99.1698,
        },
        {
          id: 4,
          identificador_externo: 'KNF-237000',
          nombre_titular: 'Sergio Pablo Castañeda Anaya',
          direccion_completa: 'Av. Revolución 520, Col. San Pedro de los Pinos, CDMX',
          municipio: 'Benito Juárez',
          dias_mora: 42,
          saldo_deudor: 604951.74,
          distancia_km: 6.4,
          tiempo_estimado_min: 22,
          clienteProducto: { nombre: 'KONFIO' },
          latitud: 19.3905,
          longitud: -99.1860,
        },
      ];
      setCuentas(mockRoute);
      setSiguienteParada(mockRoute[0]);
    }
  };

  useEffect(() => {
    fetchRutas();
  }, []);

  const abrirNavegacion = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const cuentasFiltradas = cuentas.filter(c => {
    const matchSearch = c.nombre_titular.toLowerCase().includes(search.toLowerCase()) ||
                        c.identificador_externo.toLowerCase().includes(search.toLowerCase()) ||
                        c.municipio.toLowerCase().includes(search.toLowerCase());
    const matchCliente = filtroCliente === 'TODOS' || c.clienteProducto?.nombre === filtroCliente;
    return matchSearch && matchCliente;
  });

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity
      style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
      onPress={() => navigation.navigate('CuentaDetail', { cuenta: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.indexNumber, { color: colors.primary }]}>#{index + 1}</Text>
        <View style={[styles.clientTag, { backgroundColor: colors.badgeBg }]}>
          <Text style={[styles.clientText, { color: colors.primary }]}>{item.clienteProducto?.nombre || 'VENTO'}</Text>
        </View>
        <Text style={[styles.distanceText, { color: colors.textSecondary }]}>📍 {item.distancia_km} km ({item.tiempo_estimado_min} min)</Text>
      </View>

      <Text style={[styles.titularName, { color: colors.text }]}>{item.nombre_titular}</Text>
      <Text style={[styles.addressText, { color: colors.textSecondary }]} numberOfLines={1}>{item.direccion_completa}</Text>

      <View style={[styles.cardFooter, { borderTopColor: colors.cardBorder }]}>
        <View>
          <Text style={[styles.saldoText, { color: colors.text }]}>
            ${parseFloat(item.saldo_deudor || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.moraLabel, { color: colors.textMuted }]}>Mora: {item.dias_mora} días</Text>
        </View>

        <TouchableOpacity
          style={[styles.navButtonSmall, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}
          onPress={() => abrirNavegacion(item.latitud || 19.4326, item.longitud || -99.1332)}
        >
          <Text style={[styles.navButtonSmallText, { color: colors.primary }]}>Navegar GPS</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Siguiente Parada Banner */}
      {siguienteParada && (
        <View style={[styles.recommendedCard, { backgroundColor: colors.surface, borderColor: colors.goldBorder }]}>
          <View style={styles.recTopRow}>
            <Text style={[styles.recTagText, { color: colors.primary }]}>PARADA MÁS CERCANA</Text>
            <Text style={[styles.recDist, { color: colors.textSecondary }]}>📍 {siguienteParada.distancia_km} km · ~{siguienteParada.tiempo_estimado_min} min</Text>
          </View>

          <Text style={[styles.recTitle, { color: colors.text }]}>{siguienteParada.nombre_titular}</Text>
          <Text style={[styles.recAddress, { color: colors.textSecondary }]} numberOfLines={1}>{siguienteParada.direccion_completa}</Text>

          <View style={styles.recActions}>
            <TouchableOpacity
              style={[styles.recNavBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('ModoRuta')}
            >
              <Text style={[styles.recNavBtnText, { color: colors.primaryText }]}>🧭 Asistente en Ruta Guiado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recDetailBtn, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}
              onPress={() => abrirNavegacion(siguienteParada.latitud || 19.4085, siguienteParada.longitud || -99.1628)}
            >
              <Text style={[styles.recDetailBtnText, { color: colors.primary }]}>🗺️ GPS</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TextInput
          style={[
            styles.searchInput, 
            { 
              backgroundColor: colors.inputBg, 
              borderColor: colors.inputBorder, 
              color: colors.text 
            }
          ]}
          placeholder="Buscar por titular o colonia..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        {/* Client filter pills */}
        <View style={styles.filterPills}>
          {['TODOS', 'KAVAK', 'VENTO', 'CLIP', 'KONFÍO'].map(cl => {
            const isActive = filtroCliente === cl;
            return (
              <TouchableOpacity
                key={cl}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isActive ? colors.badgeBg : colors.surface,
                    borderColor: isActive ? colors.primary : colors.cardBorder,
                  }
                ]}
                onPress={() => setFiltroCliente(cl)}
              >
                <Text style={[styles.pillText, { color: isActive ? colors.primary : colors.textSecondary, fontWeight: isActive ? '700' : '500' }]}>
                  {cl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={cuentasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchRutas().then(() => setRefreshing(false));
            }}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recommendedCard: {
    margin: 14,
    marginBottom: 6,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recDist: {
    fontSize: 11,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  recAddress: {
    fontSize: 11,
    marginBottom: 10,
  },
  recActions: {
    flexDirection: 'row',
    gap: 8,
  },
  recNavBtn: {
    flex: 2,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  recNavBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  recDetailBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  recDetailBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    fontSize: 12,
    marginBottom: 6,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 5,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 10,
  },
  listContent: {
    padding: 14,
    paddingTop: 2,
    gap: 10,
  },
  accountCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  indexNumber: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  clientTag: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  clientText: {
    fontSize: 9,
    fontWeight: '700',
  },
  distanceText: {
    fontSize: 10,
    marginLeft: 'auto',
  },
  titularName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 1,
  },
  addressText: {
    fontSize: 11,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  moraLabel: {
    fontSize: 9,
    marginTop: 1,
  },
  saldoText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  navButtonSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  navButtonSmallText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
