import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  nombre: string;
}

export const ClienteBadge: React.FC<Props> = ({ nombre }) => {
  // Asignar un color basado en el nombre del cliente
  const colores: Record<string, string> = {
    'kavak': '#000000',
    'vento': '#E11D48',
    'bbva': '#004481',
    'santander': '#EC0000',
  };
  
  const bg = colores[nombre.toLowerCase()] || '#4B5563'; // Gris por defecto

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.text}>{nombre}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});
