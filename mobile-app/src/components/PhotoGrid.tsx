import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface Props {
  photos: string[];
  onRemove?: (index: number) => void;
}

export const PhotoGrid: React.FC<Props> = ({ photos, onRemove }) => {
  if (photos.length === 0) return null;

  return (
    <View style={styles.grid}>
      {photos.map((uri, index) => (
        <View key={index} style={styles.photoContainer}>
          <Image source={{ uri }} style={styles.photo} />
          {onRemove && (
            <TouchableOpacity 
              style={styles.removeBtn} 
              onPress={() => onRemove(index)}
            >
              <Text style={styles.removeText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photoContainer: {
    width: '33.33%',
    padding: 4,
    aspectRatio: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
