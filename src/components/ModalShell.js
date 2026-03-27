import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

export function ModalShell({ visible, title, subtitle, children }) {
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 21, 14, 0.3)',
    justifyContent: 'flex-end'
  },
  content: {
    maxHeight: '88%',
    backgroundColor: '#fffaf4',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#271a13'
  },
  subtitle: {
    color: '#7d6658',
    marginTop: 6,
    marginBottom: 16
  },
  scrollContent: {
    paddingBottom: 22
  }
});
