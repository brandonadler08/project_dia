import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

interface Props {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<Props> = ({ visible, message = 'Cargando...' }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  }
});
