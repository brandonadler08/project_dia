import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const CuentaDetailScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const { cuenta } = route.params || {};

  const handleCall = () => {
    if (cuenta?.telefono) Linking.openURL(`tel:${cuenta.telefono}`);
    else alert('No hay teléfono registrado');
  };

  const handleWhatsApp = () => {
    if (cuenta?.telefono) {
      const url = `whatsapp://send?text=Estimado(a) ${encodeURIComponent(cuenta.nombre_titular || '')}, me comunico de EAD BPO referente a su cuenta de ${encodeURIComponent(cuenta.clienteProducto?.nombre || '')}.&phone=52${cuenta.telefono}`;
      Linking.openURL(url).catch(() => alert('Asegúrate de tener WhatsApp instalado'));
    } else {
      alert('No hay teléfono registrado');
    }
  };

  const handleSMS = () => {
    if (cuenta?.telefono) {
      const url = `sms:${cuenta.telefono}?body=Estimado(a) ${encodeURIComponent(cuenta.nombre_titular || '')}, me comunico de EAD BPO.`;
      Linking.openURL(url);
    }
  };

  const abrirGPS = () => {
    const lat = cuenta?.latitud || 19.4326;
    const lng = cuenta?.longitud || -99.1332;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Header Glass Card */}
        <View style={[styles.mainCard, { backgroundColor: colors.surface, borderColor: colors.goldBorder }]}>
          <View style={styles.headerRow}>
            <View style={[styles.clientTag, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}>
              <Text style={[styles.clientText, { color: colors.primary }]}>{cuenta?.clienteProducto?.nombre || 'VENTO'}</Text>
            </View>
            <View style={styles.moraTag}>
              <Text style={styles.moraText}>Mora: {cuenta?.dias_mora || 45} días</Text>
            </View>
          </View>

          <Text style={[styles.titularName, { color: colors.text }]}>{cuenta?.nombre_titular || 'Titular de Cuenta'}</Text>
          <Text style={[styles.accountId, { color: colors.textMuted }]}>ID Contrato: {cuenta?.identificador_externo || 'KVK-0000'}</Text>

          {/* Balance Row */}
          <View style={[styles.balanceGrid, { backgroundColor: colors.isDark ? '#080A0F' : '#F8FAFC', borderColor: colors.cardBorder }]}>
            <View style={styles.balanceCol}>
              <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>SALDO DEUDOR</Text>
              <Text style={[styles.balanceValue, { color: colors.text }]}>
                ${parseFloat(cuenta?.saldo_deudor || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={styles.balanceCol}>
              <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>MONTO VENCIDO</Text>
              <Text style={[styles.balanceValue, { color: '#EF4444' }]}>
                ${parseFloat(cuenta?.monto_vencido || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {/* Direct Navigation GPS CTA */}
          <TouchableOpacity style={styles.gpsNavButton} onPress={abrirGPS} activeOpacity={0.85}>
            <Text style={styles.gpsNavButtonText}>🗺️ NAVEGAR CON GOOGLE MAPS / WAZE</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons: Registrar Visita, Call, WhatsApp, SMS */}
        <View style={[styles.actionsCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <TouchableOpacity
            style={[styles.visitButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('NuevaGestion', { cuenta })}
            activeOpacity={0.85}
          >
            <Text style={[styles.visitButtonText, { color: colors.primaryText }]}>📸 REGISTRAR VISITA EN CAMPO (GPS)</Text>
          </TouchableOpacity>

          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Text style={styles.contactBtnText}>📞 Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp}>
              <Text style={styles.contactBtnText}>💬 WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smsBtn} onPress={handleSMS}>
              <Text style={styles.contactBtnText}>✉️ SMS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Address & Contact Information */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Text style={[styles.infoTitle, { color: colors.primary }]}>📍 Domicilio del Deudor</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>{cuenta?.direccion_completa || 'Dirección no especificada'}</Text>
          <Text style={[styles.infoSubText, { color: colors.textSecondary }]}>Municipio: {cuenta?.municipio} · CP: {cuenta?.cp || 'N/D'}</Text>

          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

          <Text style={[styles.infoTitle, { color: colors.primary }]}>📱 Teléfono de Contacto</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>{cuenta?.telefono || 'Sin teléfono'}</Text>
          {cuenta?.email && <Text style={[styles.infoSubText, { color: colors.textSecondary }]}>Email: {cuenta.email}</Text>}
        </View>

        {/* Additional Specific Client Details */}
        {cuenta?.datos_adicionales && (
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.infoTitle, { color: colors.primary }]}>📑 Datos de la Garantía / Préstamo</Text>
            {Object.entries(cuenta.datos_adicionales).map(([key, val]: any) => (
              <View key={key} style={styles.metaRow}>
                <Text style={[styles.metaKey, { color: colors.textSecondary }]}>{key.replace(/_/g, ' ').toUpperCase()}:</Text>
                <Text style={[styles.metaVal, { color: colors.text }]}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  mainCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  clientText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  moraTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  moraText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 'bold',
  },
  titularName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  accountId: {
    fontSize: 12,
    marginBottom: 14,
    fontFamily: 'monospace',
  },
  balanceGrid: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  balanceCol: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  gpsNavButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  gpsNavButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  actionsCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  visitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  visitButtonText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  waBtn: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  smsBtn: {
    flex: 1,
    backgroundColor: '#475569',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoSubText: {
    fontSize: 11,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaKey: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
