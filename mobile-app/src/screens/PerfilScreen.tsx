import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

export const PerfilScreen = () => {
  const { user, logout } = useAuth();
  const { mode, colors, setMode } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir de EAD BPO?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', onPress: () => logout(), style: 'destructive' }
      ]
    );
  };

  const themeOptions: { label: string; mode: ThemeMode; icon: string; desc: string }[] = [
    { label: 'Oscuro', mode: 'dark', icon: '🌙', desc: 'Fondo negro y azul marino' },
    { label: 'Claro', mode: 'light', icon: '☀️', desc: 'Fondo blanco y legible al sol' },
    { label: 'Automático', mode: 'system', icon: '⚙️', desc: 'Ajuste según el sistema' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Profile Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.goldBorder }]}>
          <View style={[styles.avatar, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{user?.nombre?.charAt(0) || 'C'}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.nombre || 'Carlos Mendoza Cruz'}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'gestor@crm.com'}</Text>
          <View style={[styles.badge, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>COMISIONISTA ACTIVO · EAD BPO</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: '#3B82F6' }]}>4</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Visitas Hoy</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>$1,850</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Comisión Hoy</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>75%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Efectividad</Text>
          </View>
        </View>

        {/* Theme Settings Selector Card */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.goldBorder }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>🎨 Configuración de Apariencia</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Selecciona el tema de la aplicación para trabajo diurno o nocturno
            </Text>
          </View>

          <View style={styles.themeOptionsGrid}>
            {themeOptions.map((opt) => {
              const isSelected = mode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[
                    styles.themeOptionBtn,
                    {
                      backgroundColor: isSelected ? colors.badgeBg : (colors.isDark ? '#141926' : '#F8FAFC'),
                      borderColor: isSelected ? colors.primary : colors.cardBorder,
                    },
                  ]}
                  onPress={() => setMode(opt.mode)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeOptionTop}>
                    <Text style={styles.themeOptionIcon}>{opt.icon}</Text>
                    {isSelected && (
                      <View style={[styles.selectedPill, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.selectedPillText, { color: colors.primaryText }]}>✓ ACTIVO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.themeOptionTitle, { color: isSelected ? colors.primary : colors.text }]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.themeOptionDesc, { color: colors.textSecondary }]}>
                    {opt.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Company Affiliation Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Text style={[styles.infoTitle, { color: colors.primary }]}>🏛️ Afiliación de Empresa</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>EAD BPO Operaciones y Gestión de Campo S.A. de C.V.</Text>
          <Text style={[styles.infoSub, { color: colors.textSecondary }]}>Carteras: Kavak · Vento · Clip · Konfío · LAFIN</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>
          EAD BPO Mobile v2.2 · {colors.isDark ? 'Modo Oscuro' : 'Modo Claro'} Activo
        </Text>
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
    gap: 14,
  },
  headerCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 17, fontWeight: 'bold' },
  email: { fontSize: 12, marginTop: 2 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
  },
  badgeText: { fontWeight: 'bold', fontSize: 10, letterSpacing: 0.5 },
  statsContainer: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: { fontSize: 18, fontWeight: '900', fontFamily: 'monospace' },
  statLabel: { fontSize: 10, marginTop: 2 },
  settingsCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  themeOptionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOptionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 90,
  },
  themeOptionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  themeOptionIcon: {
    fontSize: 18,
  },
  selectedPill: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  selectedPillText: {
    fontSize: 7,
    fontWeight: '900',
  },
  themeOptionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  themeOptionDesc: {
    fontSize: 9,
    lineHeight: 12,
  },
  infoCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  infoTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  infoText: { fontSize: 13, fontWeight: '600' },
  infoSub: { fontSize: 11, marginTop: 2 },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    padding: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 },
  version: { textAlign: 'center', fontSize: 11, marginTop: 4, marginBottom: 10 },
});
