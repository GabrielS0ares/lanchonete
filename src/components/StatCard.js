import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from './SurfaceCard';

export function StatCard({ label, value, tone = 'dark' }) {
  return (
    <SurfaceCard style={styles.wrapper}>
      <View style={[styles.dot, tone === 'accent' ? styles.dotAccent : styles.dotDark]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 120
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginBottom: 12
  },
  dotDark: {
    backgroundColor: '#2f241f'
  },
  dotAccent: {
    backgroundColor: '#d4662d'
  },
  label: {
    color: '#7a675d',
    fontSize: 13,
    marginBottom: 8
  },
  value: {
    color: '#241914',
    fontSize: 22,
    fontWeight: '700'
  }
});
