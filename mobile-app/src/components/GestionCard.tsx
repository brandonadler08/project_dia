import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Gestion } from '../types';

interface Props {
  gestion: Gestion;
  onPress: () => void;
}

export const GestionCard: React.FC<Props> = ({ gestion, onPress }) => {
  const isSuccess = gestion.resultado_exitoso;
  
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.fecha}>{formatDate(gestion.fecha)}</Text>
        <View style={[styles.badge, { backgroundColor: isSuccess ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.badgeText}>{isSuccess ? 'EXITOSO' : 'NO EXITOSO'}</Text>
        </View>
      </View>
      
      {gestion.cuenta && (
        <Text style={styles.titular} numberOfLines={1}>{gestion.cuenta.titular}</Text>
      )}
      
      <View style={styles.body}>
        <Text style={styles.label}>Código:</Text>
        <Text style={styles.codigo}>{gestion.codigo_cierre}</Text>
      </View>
      
      <View style={styles.notasContainer}>
        <Text style={styles.notas} numberOfLines={2}>{gestion.notas}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fecha: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titular: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 4,
  },
  codigo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
  },
  notasContainer: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 4,
  },
  notas: {
    fontSize: 13,
    color: '#4B5563',
    fontStyle: 'italic',
  }
});
