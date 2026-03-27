import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
        placeholderTextColor="#a28774"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14
  },
  label: {
    color: '#6f594c',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#fff8f0',
    borderWidth: 1,
    borderColor: '#ead5b4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#241914',
    fontSize: 15
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top'
  }
});
