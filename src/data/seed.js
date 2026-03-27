export const seedState = {
  products: [
    {
      id: 'product-1',
      name: 'X-Burguer',
      category: 'Lanches',
      price: 18.5,
      stock: 24,
      minStock: 8,
      unit: 'un',
      createdAt: '2026-03-25T12:00:00.000Z'
    },
    {
      id: 'product-2',
      name: 'Coxinha',
      category: 'Salgados',
      price: 7,
      stock: 36,
      minStock: 15,
      unit: 'un',
      createdAt: '2026-03-25T12:00:00.000Z'
    },
    {
      id: 'product-3',
      name: 'Refrigerante Lata',
      category: 'Bebidas',
      price: 6,
      stock: 20,
      minStock: 10,
      unit: 'un',
      createdAt: '2026-03-25T12:00:00.000Z'
    },
    {
      id: 'product-4',
      name: 'Suco Natural',
      category: 'Bebidas',
      price: 9,
      stock: 9,
      minStock: 6,
      unit: 'un',
      createdAt: '2026-03-25T12:00:00.000Z'
    }
  ],
  sales: [
    {
      id: 'sale-1',
      items: [
        {
          productId: 'product-1',
          productName: 'X-Burguer',
          quantity: 2,
          unitPrice: 18.5,
          subtotal: 37
        },
        {
          productId: 'product-3',
          productName: 'Refrigerante Lata',
          quantity: 2,
          unitPrice: 6,
          subtotal: 12
        }
      ],
      total: 49,
      paymentMethod: 'Pix',
      notes: 'Venda balcão',
      createdAt: '2026-03-26T14:00:00.000Z'
    }
  ],
  stockMovements: [
    {
      id: 'movement-1',
      productId: 'product-2',
      quantity: 15,
      reason: 'Reposição do fornecedor',
      type: 'entry',
      createdAt: '2026-03-26T09:00:00.000Z'
    },
    {
      id: 'movement-2',
      productId: 'product-4',
      quantity: 3,
      reason: 'Venda registrada',
      type: 'exit',
      createdAt: '2026-03-26T13:10:00.000Z'
    }
  ]
};
