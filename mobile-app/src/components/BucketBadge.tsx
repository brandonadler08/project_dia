import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  bucket: string;
}

export const BucketBadge: React.FC<Props> = ({ bucket }) => {
  let backgroundColor = '#10B981'; // Current / Default Green
  
  // Lógica simple de colores por bucket
  const b = bucket.toLowerCase();
  if (b.includes('1-30') || b.includes('1')) backgroundColor = '#F59E0B'; // Yellow
  else if (b.includes('31-60') || b.includes('2')) backgroundColor = '#F97316'; // Orange
  else if (b.includes('61-90') || b.includes('3')) backgroundColor = '#EF4444'; // Red
  else if (b.includes('90') || b.includes('4') || b.includes('castigo')) backgroundColor = '#991B1B'; // Dark Red

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{bucket.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
