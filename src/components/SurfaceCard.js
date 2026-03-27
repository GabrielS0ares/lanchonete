import React from 'react';
import { StyleSheet, View } from 'react-native';

export function SurfaceCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffdf8',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0dfc5'
  }
});
