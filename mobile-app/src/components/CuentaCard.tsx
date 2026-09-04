import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Cuenta } from '../types';
import { BucketBadge } from './BucketBadge';
import { ClienteBadge } from './ClienteBadge';

interface Props {
  cuenta: Cuenta;
  onPress: () => void;
}

export const CuentaCard: React.FC<Props> = ({ cuenta, onPress }) => {
  const formatMoney = (amount: number) => {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.titular} numberOfLines={1}>{cuenta.titular}</Text>
        <ClienteBadge nombre={cuenta.cliente.nombre} />
      </View>
      
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.label}>Saldo:</Text>
          <Text style={styles.value}>{formatMoney(cuenta.saldo)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Días Mora:</Text>
          <Text style={styles.value}>{cuenta.dias_mora}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.value} numberOfLines={2}>{cuenta.direccion_completa}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <BucketBadge bucket={cuenta.bucket} />
        <Text style={styles.estado}>{cuenta.estado}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titular: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  body: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 80,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  estado: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
  }
});
