import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

export const HistorialScreen = () => {
  const gestiones = [
    {
      id: 1,
      cuenta: 'KVK-2918093',
      titular: 'Marco Antonio Salazar Rodríguez',
      cliente: 'KAVAK',
      fecha: 'Hoy 14:30',
      codigo: 'Promesa de Pago',
      resultado: 'Exitoso',
      comision: 400.0,
      notas: 'Se acordó pago de $12,500 MXN para este viernes 5.',
    },
    {
      id: 2,
      cuenta: 'VNT-5075881',
      titular: 'José Antonio Solís Sánchez',
      cliente: 'VENTO',
      fecha: 'Hoy 13:15',
      codigo: 'Dación / Recuperación',
      resultado: 'Exitoso',
      comision: 350.0,
      notas: 'Se recuperó motocicleta Falkon 250CC con video de evidencia.',
    },
    {
      id: 3,
      cuenta: 'CLP-12bd2c09',
      titular: 'Axel Joaquín Osorio Peña',
      cliente: 'CLIP',
      fecha: 'Hoy 11:45',
      codigo: 'No Localizado',
      resultado: 'No Exitoso',
      comision: 0.0,
      notas: 'Local comercial cerrado con candado, se dejó citatorio.',
    },
    {
      id: 4,
      cuenta: 'KNF-237000',
      titular: 'Sergio Pablo Castañeda Anaya',
      cliente: 'KONFIO',
      fecha: 'Hoy 10:20',
      codigo: 'Promesa de Pago',
      resultado: 'Exitoso',
      comision: 550.0,
      notas: 'Aceptó propuesta de liquidación One Shot con 50% desc.',
    },
  ];

  const renderItem = ({ item }: { item: typeof gestiones[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.clientTag}>
          <Text style={styles.clientText}>{item.cliente}</Text>
        </View>
        <Text style={styles.dateText}>{item.fecha}</Text>
      </View>

      <Text style={styles.titular}>{item.titular}</Text>
      <Text style={styles.contractId}>ID: {item.cuenta} · {item.codigo}</Text>

      <View style={styles.footerRow}>
        <View style={[styles.resultBadge, item.resultado === 'Exitoso' ? styles.badgeSuccess : styles.badgeDanger]}>
          <Text style={[styles.resultText, item.resultado === 'Exitoso' ? styles.textSuccess : styles.textDanger]}>
            {item.resultado === 'Exitoso' ? '✓ Contacto Exitoso' : '✕ No Exitoso'}
          </Text>
        </View>

        {item.comision > 0 && (
          <Text style={styles.comisionText}>+ ${item.comision} MXN</Text>
        )}
      </View>

      {item.notas && (
        <Text style={styles.notesText}>💬 "{item.notas}"</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={gestiones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  listContent: { padding: 16, gap: 12 },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clientTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  clientText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold' },
  dateText: { color: '#94A3B8', fontSize: 11 },
  titular: { fontSize: 15, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2 },
  contractId: { fontSize: 11, color: '#94A3B8', marginBottom: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  resultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)' },
  badgeDanger: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' },
  resultText: { fontSize: 11, fontWeight: 'bold' },
  textSuccess: { color: '#10B981' },
  textDanger: { color: '#EF4444' },
  comisionText: { color: '#F3C64F', fontSize: 13, fontWeight: '900', fontFamily: 'monospace' },
  notesText: { color: '#CBD5E1', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
});
