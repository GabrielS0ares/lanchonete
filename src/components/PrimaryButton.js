import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function PrimaryButton({ title, onPress, variant = 'filled', disabled = false, style }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'filled' ? styles.filled : styles.outline,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[styles.text, variant === 'filled' ? styles.textFilled : styles.textOutline]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filled: {
    backgroundColor: '#c75827'
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d7b690'
  },
  pressed: {
    opacity: 0.85
  },
  disabled: {
    opacity: 0.45
  },
  text: {
    fontWeight: '700',
    fontSize: 15
  },
  textFilled: {
    color: '#fffaf6'
  },
  textOutline: {
    color: '#6c4734'
  }
});
