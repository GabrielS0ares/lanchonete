import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { Field } from './Field';
import { ModalShell } from './ModalShell';
import { PrimaryButton } from './PrimaryButton';
import { SurfaceCard } from './SurfaceCard';

const paymentOptions = ['Pix', 'Dinheiro', 'Cartao'];

export function SaleFormModal({ visible, onClose }) {
  const { state, registerSale } = useApp();
  const [selected, setSelected] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [notes, setNotes] = useState('');

  const total = useMemo(
    () =>
      selected.reduce((acc, item) => {
        const product = state.products.find((candidate) => candidate.id === item.productId);
        return acc + (product ? product.price * item.quantity : 0);
      }, 0),
    [selected, state.products]
  );

  function resetAndClose() {
    setSelected([]);
    setPaymentMethod('Pix');
    setNotes('');
    onClose();
  }

  function toggleProduct(productId) {
    setSelected((current) => {
      const exists = current.find((item) => item.productId === productId);
      if (exists) {
        return current.filter((item) => item.productId !== productId);
      }
      return [...current, { productId, quantity: 1 }];
    });
  }

  function updateQuantity(productId, quantity) {
    const product = state.products.find((candidate) => candidate.id === productId);
    const parsed = Math.max(1, Number(quantity) || 1);
    const safeQuantity = product ? Math.min(parsed, product.stock) : parsed;
    setSelected((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity: safeQuantity } : item))
    );
  }

  function handleSubmit() {
    if (!selected.length) {
      Alert.alert('Venda vazia', 'Selecione pelo menos um produto para registrar a venda.');
      return;
    }

    const invalidItem = selected.find((item) => {
      const product = state.products.find((candidate) => candidate.id === item.productId);
      return !product || product.stock < item.quantity;
    });

    if (invalidItem) {
      Alert.alert('Estoque insuficiente', 'Revise as quantidades escolhidas antes de concluir a venda.');
      return;
    }

    registerSale({
      items: selected,
      paymentMethod,
      notes: notes.trim()
    });
    resetAndClose();
    Alert.alert('Venda registrada', 'A venda foi salva e o estoque foi atualizado automaticamente.');
  }

  return (
    <ModalShell
      visible={visible}
      title="Registrar venda"
      subtitle="Selecione os produtos vendidos e informe a forma de pagamento."
    >
      {state.products.map((product) => {
        const currentItem = selected.find((item) => item.productId === product.id);
        return (
          <SurfaceCard key={product.id} style={styles.productCard}>
            <Pressable onPress={() => toggleProduct(product.id)} style={styles.productHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {formatCurrency(product.price)} • Estoque {product.stock} {product.unit}
                </Text>
              </View>
              <View style={[styles.checkbox, currentItem && styles.checkboxActive]} />
            </Pressable>
            {currentItem && (
              <Field
                label="Quantidade"
                value={String(currentItem.quantity)}
                onChangeText={(value) => updateQuantity(product.id, value)}
                placeholder="1"
                keyboardType="number-pad"
              />
            )}
          </SurfaceCard>
        );
      })}

      <Text style={styles.label}>Forma de pagamento</Text>
      <View style={styles.chipRow}>
        {paymentOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setPaymentMethod(option)}
            style={[styles.chip, paymentMethod === option && styles.chipActive]}
          >
            <Text style={[styles.chipText, paymentMethod === option && styles.chipTextActive]}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Field label="Observacoes" value={notes} onChangeText={setNotes} placeholder="Opcional" multiline />
      <Text style={styles.total}>Total da venda: {formatCurrency(total)}</Text>
      <View style={styles.actions}>
        <PrimaryButton title="Cancelar" variant="outline" onPress={resetAndClose} style={styles.action} />
        <PrimaryButton title="Concluir venda" onPress={handleSubmit} style={styles.action} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 12
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  productName: {
    color: '#261b14',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4
  },
  productMeta: {
    color: '#7b675c'
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#d2b28c'
  },
  checkboxActive: {
    backgroundColor: '#c75827',
    borderColor: '#c75827'
  },
  label: {
    color: '#6f594c',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600'
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d9b996',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff8f0'
  },
  chipActive: {
    backgroundColor: '#c75827',
    borderColor: '#c75827'
  },
  chipText: {
    color: '#6c4734',
    fontWeight: '600'
  },
  chipTextActive: {
    color: '#fffaf6'
  },
  total: {
    color: '#2a1c15',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 12
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  action: {
    flex: 1
  }
});
