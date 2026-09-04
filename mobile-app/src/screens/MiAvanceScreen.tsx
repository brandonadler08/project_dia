import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const MiAvanceScreen = () => {
  const { colors } = useTheme();
  const [tabRanking, setTabRanking] = useState<'mi_avance' | 'tabla_lideres'>('mi_avance');

  const [metricas] = useState({
    posicion_ranking: 1,
    total_gestores: 18,
    comisiones_acumuladas: 18450.0,
    visitas_completadas_semana: 48,
    visitas_hoy: 4,
    tasa_efectividad: 87.5,
    meta_semanal: 50,
    porcentaje_meta: 96,
    monto_recuperado: 485200.00,
    racha_dias: 12,
  });

  const [tablaLideres] = useState([
    { rank: 1, nombre: 'Carlos Mendoza (Tú)', visitas: 48, efectividad: 87.5, comision: 18450, badge: '👑 1°', esPropio: true },
    { rank: 2, nombre: 'Héctor Valencia', visitas: 42, efectividad: 83.3, comision: 15800, badge: '🥈 2°', esPropio: false },
    { rank: 3, nombre: 'María Elena López', visitas: 39, efectividad: 79.5, comision: 13900, badge: '🥉 3°', esPropio: false },
    { rank: 4, nombre: 'Alejandro Domínguez', visitas: 34, efectividad: 73.5, comision: 11200, badge: '#4', esPropio: false },
    { rank: 5, nombre: 'Roberto Gómez', visitas: 28, efectividad: 67.8, comision: 8900, badge: '#5', esPropio: false },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Tab Switcher */}
      <View style={[styles.tabSwitcher, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          style={[
            styles.switchBtn, 
            tabRanking === 'mi_avance' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setTabRanking('mi_avance')}
        >
          <Text style={[
            styles.switchText, 
            { color: tabRanking === 'mi_avance' ? colors.primaryText : colors.textSecondary }
          ]}>
            📊 Mi Avance Individual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchBtn, 
            tabRanking === 'tabla_lideres' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setTabRanking('tabla_lideres')}
        >
          <Text style={[
            styles.switchText, 
            { color: tabRanking === 'tabla_lideres' ? colors.primaryText : colors.textSecondary }
          ]}>
            🏆 Ranking de Cuadrilla
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 600);
            }}
            tintColor={colors.primary}
          />
        }
      >
        {tabRanking === 'mi_avance' ? (
          <>
            {/* Gestor Ranking Position Card */}
            <View style={[styles.rankingLeaderBanner, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <View style={[styles.trophyCircle, { backgroundColor: colors.badgeBg, borderColor: colors.primary }]}>
                <Text style={styles.trophyIcon}>👑</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rankingTopTitle, { color: colors.primary }]}>POSICIÓN EN EL RANKING</Text>
                <Text style={[styles.rankingTopPos, { color: colors.text }]}>#1 de {metricas.total_gestores} Gestores</Text>
                <Text style={[styles.rankingTopSub, { color: colors.textSecondary }]}>¡Líder de cuadrilla esta semana! Racha de {metricas.racha_dias} días 🔥</Text>
              </View>
            </View>

            {/* Big Earnings / Commission Card */}
            <View style={[styles.earningsCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <Text style={[styles.earningsLabel, { color: colors.primary }]}>COMISIONES GANADAS ESTA SEMANA</Text>
              <Text style={[styles.earningsValue, { color: colors.text }]}>
                ${metricas.comisiones_acumuladas.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <Text style={[styles.currency, { color: colors.textMuted }]}>MXN</Text>
              </Text>

              <View style={styles.bonusRow}>
                <Text style={[styles.bonusText, { color: colors.textSecondary }]}>Meta: {metricas.meta_semanal} visitas ({metricas.visitas_completadas_semana}/{metricas.meta_semanal})</Text>
                <Text style={[styles.bonusPercent, { color: colors.primary }]}>{metricas.porcentaje_meta}% alcanzado</Text>
              </View>

              {/* Progress Bar */}
              <View style={[styles.progressBarBg, { backgroundColor: colors.badgeBg }]}>
                <View style={[styles.progressBarFill, { width: `${metricas.porcentaje_meta}%`, backgroundColor: colors.primary }]} />
              </View>
            </View>

            {/* 4 Stats Grid */}
            <View style={styles.gridContainer}>
              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{metricas.visitas_completadas_semana}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Visitas Semana</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.statNumber, { color: '#10B981' }]}>{metricas.tasa_efectividad}%</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Efectividad</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>${(metricas.monto_recuperado / 1000).toFixed(0)}k</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Recuperado ($)</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.statNumber, { color: '#3B82F6' }]}>🔥 {metricas.racha_dias}d</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Racha Activa</Text>
              </View>
            </View>

            {/* Motivational Banner */}
            <View style={[styles.motivationalCard, { backgroundColor: colors.surface, borderColor: colors.goldBorder }]}>
              <Text style={[styles.motivationalTitle, { color: colors.primary }]}>🏆 Bono de Liderazgo Activo</Text>
              <Text style={[styles.motivationalText, { color: colors.textSecondary }]}>
                Mantén el puesto #1 al cierre del domingo para recibir el bono adicional de cuadrilla de +$2,000.00 MXN.
              </Text>
            </View>
          </>
        ) : (
          /* Leaderboard Tab */
          <View style={[styles.leaderboardContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <View style={[styles.leaderboardHeader, { borderBottomColor: colors.cardBorder }]}>
              <Text style={[styles.leaderboardTitle, { color: colors.text }]}>Tabla General de Posiciones</Text>
              <Text style={[styles.leaderboardSub, { color: colors.textSecondary }]}>Actualizado en tiempo real según visitas georreferenciadas</Text>
            </View>

            {tablaLideres.map((item) => (
              <View
                key={item.rank}
                style={[
                  styles.leaderRow, 
                  { borderBottomColor: colors.cardBorder },
                  item.esPropio && { backgroundColor: colors.badgeBg, borderColor: colors.primary, borderWidth: 1 }
                ]}
              >
                <Text style={[styles.leaderRank, { color: item.rank === 1 ? colors.primary : colors.textMuted }]}>
                  {item.badge}
                </Text>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.leaderName, { color: item.esPropio ? colors.primary : colors.text }]}>
                    {item.nombre}
                  </Text>
                  <Text style={[styles.leaderSub, { color: colors.textSecondary }]}>
                    {item.visitas} visitas · {item.efectividad}% efectividad
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.leaderComision, { color: colors.primary }]}>
                    +${item.comision.toLocaleString()}
                  </Text>
                  <Text style={[styles.leaderComisionSub, { color: colors.textMuted }]}>comisión</Text>
                </View>
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
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 10,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  switchText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  rankingLeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  trophyCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trophyIcon: {
    fontSize: 22,
  },
  rankingTopTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rankingTopPos: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },
  rankingTopSub: {
    fontSize: 11,
    marginTop: 2,
  },
  earningsCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  earningsLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 4,
    fontFamily: 'monospace',
  },
  currency: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  bonusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 6,
  },
  bonusText: {
    fontSize: 11,
  },
  bonusPercent: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  motivationalCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  motivationalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  motivationalText: {
    fontSize: 11,
    lineHeight: 16,
  },
  leaderboardContainer: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  leaderboardHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  leaderboardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaderboardSub: {
    fontSize: 10,
    marginTop: 2,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  leaderRank: {
    fontSize: 14,
    fontWeight: '900',
    width: 32,
  },
  leaderName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  leaderSub: {
    fontSize: 10,
    marginTop: 1,
  },
  leaderComision: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  leaderComisionSub: {
    fontSize: 9,
  },
});
