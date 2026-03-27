import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seedState } from '../data/seed';

const STORAGE_KEY = '@lanchonete:state';

const AppContext = createContext(null);

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function todayIso() {
  return new Date().toISOString();
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD_PRODUCT': {
      const product = {
        id: makeId('product'),
        createdAt: todayIso(),
        ...action.payload
      };
      return {
        ...state,
        products: [product, ...state.products]
      };
    }
    case 'UPDATE_PRODUCT': {
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        )
      };
    }
    case 'ADJUST_STOCK': {
      const { productId, quantity, reason, type } = action.payload;
      const product = state.products.find((item) => item.id === productId);
      if (!product) {
        return state;
      }

      const nextStock = type === 'entry' ? product.stock + quantity : product.stock - quantity;
      if (nextStock < 0) {
        return state;
      }

      return {
        ...state,
        products: state.products.map((item) =>
          item.id === productId ? { ...item, stock: nextStock } : item
        ),
        stockMovements: [
          {
            id: makeId('movement'),
            productId,
            quantity,
            reason,
            type,
            createdAt: todayIso()
          },
          ...state.stockMovements
        ]
      };
    }
    case 'REGISTER_SALE': {
      const { items, paymentMethod, notes } = action.payload;
      const normalizedItems = items
        .map((item) => {
          const product = state.products.find((candidate) => candidate.id === item.productId);
          if (!product) {
            return null;
          }

          return {
            productId: item.productId,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotal: product.price * item.quantity
          };
        })
        .filter(Boolean);

      if (!normalizedItems.length) {
        return state;
      }

      const canFulfill = normalizedItems.every((item) => {
        const product = state.products.find((candidate) => candidate.id === item.productId);
        return product && product.stock >= item.quantity;
      });

      if (!canFulfill) {
        return state;
      }

      const total = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);
      return {
        ...state,
        products: state.products.map((product) => {
          const item = normalizedItems.find((candidate) => candidate.productId === product.id);
          return item ? { ...product, stock: product.stock - item.quantity } : product;
        }),
        sales: [
          {
            id: makeId('sale'),
            items: normalizedItems,
            total,
            paymentMethod,
            notes,
            createdAt: todayIso()
          },
          ...state.sales
        ],
        stockMovements: [
          ...normalizedItems.map((item) => ({
            id: makeId('movement'),
            productId: item.productId,
            quantity: item.quantity,
            reason: 'Venda registrada',
            type: 'exit',
            createdAt: todayIso()
          })),
          ...state.stockMovements
        ]
      };
    }
    case 'RESET_DATA':
      return seedState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, seedState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadState() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
        }
      } catch (error) {
        console.warn('Falha ao carregar dados locais', error);
      } finally {
        setIsReady(true);
      }
    }

    loadState();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) => {
      console.warn('Falha ao salvar dados locais', error);
    });
  }, [state, isReady]);

  const value = useMemo(
    () => ({
      state,
      isReady,
      addProduct: (payload) => dispatch({ type: 'ADD_PRODUCT', payload }),
      updateProduct: (payload) => dispatch({ type: 'UPDATE_PRODUCT', payload }),
      adjustStock: (payload) => dispatch({ type: 'ADJUST_STOCK', payload }),
      registerSale: (payload) => dispatch({ type: 'REGISTER_SALE', payload }),
      resetData: () => dispatch({ type: 'RESET_DATA' })
    }),
    [state, isReady]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}
