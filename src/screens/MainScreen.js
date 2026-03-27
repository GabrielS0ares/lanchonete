import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { ProductFormModal } from '../components/ProductFormModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { SaleFormModal } from '../components/SaleFormModal';
import { StatCard } from '../components/StatCard';
import { StockAdjustModal } from '../components/StockAdjustModal';
import { SurfaceCard } from '../components/SurfaceCard';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDateTime } from '../utils/format';

const tabs = [
  { key: 'dashboard', label: 'Inicio' },
  { key: 'products', label: 'Produtos' },
  { key: 'sales', label: 'Vendas' },
  { key: 'stock', label: 'Estoque' }
];

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>Gestao local</Text>
      <Text style={styles.title}>Controle da Lanchonete</Text>
      <Text style={styles.subtitle}>
        Registre produtos, acompanhe vendas e mantenha o estoque organizado em uma rotina simples.
      </Text>
    </View>
  );
}

function DashboardTab() {
  const { state } = useApp();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const salesToday = state.sales.filter((sale) => new Date(sale.createdAt).toDateString() === today);
    const revenueToday = salesToday.reduce((acc, sale) => acc + sale.total, 0);
    const lowStock = state.products.filter((product) => product.stock <= product.minStock).length;
    return {
      revenueToday,
      lowStock,
      totalProducts: state.products.length,
      totalSales: state.sales.length
    };
  }, [state.products, state.sales]);

  return (
    <>
      <View style={styles.grid}>
        <StatCard label="Faturamento do dia" value={formatCurrency(stats.revenueToday)} tone="accent" />
        <StatCard label="Itens em estoque baixo" value={String(stats.lowStock)} />
      </View>
      <View style={styles.grid}>
        <StatCard label="Produtos cadastrados" value={String(stats.totalProducts)} />
        <StatCard label="Vendas registradas" value={String(stats.totalSales)} tone="accent" />
      </View>

      <SurfaceCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Resumo rapido</Text>
        <Text style={styles.paragraph}>
          O aplicativo foi pensado para uma lanchonete com operacao simples, mas precisa de mais seguranca no
          controle de vendas, reposicao e consulta de mercadorias.
        </Text>
      </SurfaceCard>

      <SurfaceCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Prioridades do dia</Text>
        {state.products
          .filter((product) => product.stock <= product.minStock)
          .slice(0, 5)
          .map((product) => (
            <View key={product.id} style={styles.rowBetween}>
              <View>
                <Text style={styles.itemTitle}>{product.name}</Text>
                <Text style={styles.itemSubtitle}>Categoria {product.category}</Text>
              </View>
              <Text style={styles.warningText}>
                {product.stock}/{product.minStock} {product.unit}
              </Text>
            </View>
          ))}
        {!state.products.some((product) => product.stock <= product.minStock) && (
          <Text style={styles.emptyText}>Nenhum produto com estoque critico no momento.</Text>
        )}
      </SurfaceCard>
    </>
  );
}

function ProductsTab({ onCreate, onEdit }) {
  const { state } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return state.products;
    }
    return state.products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
    );
  }, [search, state.products]);

  return (
    <>
      <View style={styles.actionsRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar produto"
          placeholderTextColor="#9b7d68"
          style={styles.searchInput}
        />
        <PrimaryButton title="Novo" onPress={onCreate} style={styles.smallButton} />
      </View>
      {filtered.map((product) => (
        <SurfaceCard key={product.id} style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.itemTitle}>{product.name}</Text>
              <Text style={styles.itemSubtitle}>
                {product.category} • {formatCurrency(product.price)}
              </Text>
              <Text style={styles.itemSubtitle}>ID {product.id}</Text>
            </View>
            <PrimaryButton title="Editar" variant="outline" onPress={() => onEdit(product)} />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.stockLabel}>Estoque atual</Text>
            <Text style={styles.stockValue}>
              {product.stock} {product.unit}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.stockLabel}>Minimo recomendado</Text>
            <Text style={product.stock <= product.minStock ? styles.warningText : styles.stockValue}>
              {product.minStock} {product.unit}
            </Text>
          </View>
        </SurfaceCard>
      ))}
      {!filtered.length && <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
    </>
  );
}

function SalesTab({ onCreate }) {
  const { state } = useApp();

  return (
    <>
      <PrimaryButton title="Registrar nova venda" onPress={onCreate} />
      {state.sales.map((sale) => (
        <SurfaceCard key={sale.id} style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemTitle}>{formatCurrency(sale.total)}</Text>
            <Text style={styles.itemSubtitle}>{formatDateTime(sale.createdAt)}</Text>
          </View>
          <Text style={styles.itemSubtitle}>Pagamento: {sale.paymentMethod}</Text>
          <Text style={styles.itemSubtitle}>Itens:</Text>
          {sale.items.map((item) => (
            <Text key={`${sale.id}-${item.productId}`} style={styles.saleItem}>
              {item.quantity}x {item.productName} • {formatCurrency(item.subtotal)}
            </Text>
          ))}
          {!!sale.notes && <Text style={styles.notes}>Obs.: {sale.notes}</Text>}
        </SurfaceCard>
      ))}
      {!state.sales.length && <Text style={styles.emptyText}>Nenhuma venda registrada ainda.</Text>}
    </>
  );
}

function StockTab({ onAdjust }) {
  const { state } = useApp();

  return (
    <>
      <PrimaryButton title="Ajustar estoque" onPress={onAdjust} />
      <SurfaceCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Situacao atual</Text>
        {state.products.map((product) => (
          <View key={product.id} style={styles.stockItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{product.name}</Text>
              <Text style={styles.itemSubtitle}>ID {product.id}</Text>
            </View>
            <Text style={product.stock <= product.minStock ? styles.warningText : styles.stockValue}>
              {product.stock} {product.unit}
            </Text>
          </View>
        ))}
      </SurfaceCard>
      <SurfaceCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Movimentacoes recentes</Text>
        {state.stockMovements.map((movement) => {
          const product = state.products.find((item) => item.id === movement.productId);
          return (
            <View key={movement.id} style={styles.stockItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{product?.name || movement.productId}</Text>
                <Text style={styles.itemSubtitle}>
                  {movement.reason} • {formatDateTime(movement.createdAt)}
                </Text>
              </View>
              <Text style={movement.type === 'entry' ? styles.entryText : styles.warningText}>
                {movement.type === 'entry' ? '+' : '-'}
                {movement.quantity}
              </Text>
            </View>
          );
        })}
      </SurfaceCard>
    </>
  );
}

export function MainScreen() {
  const { isReady, addProduct, updateProduct, resetData } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);

  function openCreateProduct() {
    setEditingProduct(null);
    setProductModalOpen(true);
  }

  function openEditProduct(product) {
    setEditingProduct(product);
    setProductModalOpen(true);
  }

  function handleProductSubmit(payload) {
    if (payload.id) {
      updateProduct(payload);
      return;
    }
    addProduct(payload);
  }

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#c75827" />
        <Text style={styles.loadingText}>Carregando dados da lanchonete...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header />
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            >
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'products' && <ProductsTab onCreate={openCreateProduct} onEdit={openEditProduct} />}
        {activeTab === 'sales' && <SalesTab onCreate={() => setSaleModalOpen(true)} />}
        {activeTab === 'stock' && <StockTab onAdjust={() => setStockModalOpen(true)} />}

        <PrimaryButton title="Restaurar dados de exemplo" variant="outline" onPress={resetData} />
      </ScrollView>

      <ProductFormModal
        visible={productModalOpen}
        product={editingProduct}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleProductSubmit}
      />
      <SaleFormModal visible={saleModalOpen} onClose={() => setSaleModalOpen(false)} />
      <StockAdjustModal visible={stockModalOpen} onClose={() => setStockModalOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe2'
  },
  content: {
    padding: 18,
    paddingBottom: 40
  },
  header: {
    backgroundColor: '#2a1b14',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18
  },
  eyebrow: {
    color: '#f0c48e',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 10
  },
  title: {
    color: '#fff8f2',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10
  },
  subtitle: {
    color: '#dbc6b9',
    lineHeight: 20
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#efdfc7'
  },
  tabButtonActive: {
    backgroundColor: '#c75827'
  },
  tabLabel: {
    color: '#5f4739',
    fontWeight: '700'
  },
  tabLabelActive: {
    color: '#fff7f2'
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  sectionCard: {
    marginBottom: 12,
    marginTop: 12
  },
  sectionTitle: {
    color: '#281d16',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 12
  },
  paragraph: {
    color: '#715f54',
    lineHeight: 21
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  itemTitle: {
    color: '#281c15',
    fontWeight: '700',
    fontSize: 15
  },
  itemSubtitle: {
    color: '#77645a',
    marginTop: 2
  },
  warningText: {
    color: '#bf4c24',
    fontWeight: '700'
  },
  entryText: {
    color: '#2d8a57',
    fontWeight: '700'
  },
  emptyText: {
    color: '#7c685e',
    textAlign: 'center',
    paddingVertical: 18
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    minHeight: 48,
    backgroundColor: '#fff8f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ead5b4',
    paddingHorizontal: 14,
    color: '#241914'
  },
  smallButton: {
    minWidth: 88
  },
  stockLabel: {
    color: '#74635a'
  },
  stockValue: {
    color: '#281c15',
    fontWeight: '700'
  },
  saleItem: {
    color: '#4e3f38',
    marginTop: 6
  },
  notes: {
    color: '#62483d',
    marginTop: 10,
    fontStyle: 'italic'
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1e3cc'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: {
    color: '#755f54'
  }
});
