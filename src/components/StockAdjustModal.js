import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { Field } from './Field';
import { ModalShell } from './ModalShell';
import { PrimaryButton } from './PrimaryButton';

export function StockAdjustModal({ visible, onClose }) {
  const { state, adjustStock } = useApp();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('entry');

  useEffect(() => {
    if (visible) {
      setProductId(state.products[0]?.id || '');
    }
  }, [visible, state.products]);

  function resetAndClose() {
    setProductId(state.products[0]?.id || '');
    setQuantity('');
    setReason('');
    setType('entry');
    onClose();
  }

  function handleSubmit() {
    const amount = Number(quantity) || 0;
    const product = state.products.find((item) => item.id === productId);

    if (!productId || amount <= 0) {
      Alert.alert('Dados incompletos', 'Informe um produto e uma quantidade maior que zero.');
      return;
    }

    if (type === 'exit' && product && amount > product.stock) {
      Alert.alert('Saida invalida', 'A quantidade informada e maior do que o estoque disponivel.');
      return;
    }

    adjustStock({
      productId,
      quantity: amount,
      reason: reason.trim() || (type === 'entry' ? 'Entrada manual' : 'Saida manual'),
      type
    });
    resetAndClose();
    Alert.alert('Estoque atualizado', 'A movimentacao foi registrada com sucesso.');
  }

  return (
    <ModalShell
      visible={visible}
      title="Ajustar estoque"
      subtitle="Registre entradas e saidas para manter o controle atualizado."
    >
      <Text style={styles.label}>Produto</Text>
      <View style={styles.list}>
        {state.products.map((product) => {
          const active = product.id === productId;
          return (
            <Pressable
              key={product.id}
              onPress={() => setProductId(product.id)}
              style={[styles.productItem, active && styles.productItemActive]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.productTitle, active && styles.productTitleActive]}>{product.name}</Text>
                <Text style={[styles.productSubtitle, active && styles.productSubtitleActive]}>
                  Estoque atual: {product.stock} {product.unit}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Tipo de movimentacao</Text>
      <View style={styles.choiceRow}>
        <Pressable onPress={() => setType('entry')} style={[styles.choice, type === 'entry' && styles.choiceActive]}>
          <Text style={[styles.choiceText, type === 'entry' && styles.choiceTextActive]}>Entrada</Text>
        </Pressable>
        <Pressable onPress={() => setType('exit')} style={[styles.choice, type === 'exit' && styles.choiceActive]}>
          <Text style={[styles.choiceText, type === 'exit' && styles.choiceTextActive]}>Saida</Text>
        </Pressable>
      </View>

      <Field
        label="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="0"
        keyboardType="number-pad"
      />
      <Field label="Motivo" value={reason} onChangeText={setReason} placeholder="Reposicao, perda, acerto..." />
      <View style={styles.actions}>
        <PrimaryButton title="Cancelar" variant="outline" onPress={resetAndClose} style={styles.action} />
        <PrimaryButton title="Salvar ajuste" onPress={handleSubmit} style={styles.action} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#6f594c',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600'
  },
  list: {
    gap: 10,
    marginBottom: 14
  },
  productItem: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ead5b4',
    backgroundColor: '#fff8f0',
    padding: 14
  },
  productItemActive: {
    backgroundColor: '#c75827',
    borderColor: '#c75827'
  },
  productTitle: {
    color: '#2a1d16',
    fontWeight: '700',
    marginBottom: 4
  },
  productTitleActive: {
    color: '#fffaf6'
  },
  productSubtitle: {
    color: '#76655b'
  },
  productSubtitleActive: {
    color: '#f6ddd2'
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  choice: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d9b996',
    backgroundColor: '#fff8f0',
    paddingVertical: 12,
    alignItems: 'center'
  },
  choiceActive: {
    backgroundColor: '#c75827',
    borderColor: '#c75827'
  },
  choiceText: {
    color: '#6c4734',
    fontWeight: '700'
  },
  choiceTextActive: {
    color: '#fffaf6'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  action: {
    flex: 1
  }
});
