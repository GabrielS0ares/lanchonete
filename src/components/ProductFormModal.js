import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Field } from './Field';
import { ModalShell } from './ModalShell';
import { PrimaryButton } from './PrimaryButton';

const initialForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
  minStock: '',
  unit: 'un'
};

export function ProductFormModal({ visible, product, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        minStock: String(product.minStock),
        unit: product.unit
      });
      return;
    }
    setForm(initialForm);
  }, [product, visible]);

  function handleSubmit() {
    if (!form.name.trim()) {
      return;
    }

    onSubmit({
      ...(product ? { id: product.id } : {}),
      name: form.name.trim(),
      category: form.category.trim() || 'Geral',
      price: Number(String(form.price).replace(',', '.')) || 0,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
      unit: form.unit.trim() || 'un'
    });
    onClose();
  }

  return (
    <ModalShell
      visible={visible}
      title={product ? 'Editar produto' : 'Novo produto'}
      subtitle="Cadastre itens vendidos ou usados na rotina da lanchonete."
    >
      <Field
        label="Nome do produto"
        value={form.name}
        onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
        placeholder="Ex.: X-Salada"
      />
      <Field
        label="Categoria"
        value={form.category}
        onChangeText={(value) => setForm((current) => ({ ...current, category: value }))}
        placeholder="Ex.: Lanches"
      />
      <Field
        label="Preco"
        value={form.price}
        onChangeText={(value) => setForm((current) => ({ ...current, price: value }))}
        placeholder="0,00"
        keyboardType="decimal-pad"
      />
      <Field
        label="Estoque atual"
        value={form.stock}
        onChangeText={(value) => setForm((current) => ({ ...current, stock: value }))}
        placeholder="0"
        keyboardType="number-pad"
      />
      <Field
        label="Estoque minimo"
        value={form.minStock}
        onChangeText={(value) => setForm((current) => ({ ...current, minStock: value }))}
        placeholder="0"
        keyboardType="number-pad"
      />
      <Field
        label="Unidade"
        value={form.unit}
        onChangeText={(value) => setForm((current) => ({ ...current, unit: value }))}
        placeholder="un"
      />
      <View style={styles.actions}>
        <PrimaryButton title="Cancelar" variant="outline" onPress={onClose} style={styles.action} />
        <PrimaryButton title="Salvar" onPress={handleSubmit} style={styles.action} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  action: {
    flex: 1
  }
});
