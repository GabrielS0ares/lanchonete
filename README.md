# Controle da Lanchonete

Aplicativo React Native com Expo para controle local de vendas e estoque de uma lanchonete.

## Funcionalidades

- Cadastro e edicao de produtos
- Controle de estoque atual e estoque minimo
- Registro de vendas com baixa automatica no estoque
- Historico de vendas
- Ajustes manuais de entrada e saida no estoque
- Persistencia local com `AsyncStorage`
- Dashboard com indicadores principais

## Executar

```bash
npm install
npm run start
```

Depois, abra no Expo Go ou em um emulador Android.

## Estrutura

- `App.js`: ponto de entrada
- `src/context/AppContext.js`: estado global e regras de negocio
- `src/screens/MainScreen.js`: telas principais e navegacao
- `src/components`: componentes reutilizaveis
- `src/data/seed.js`: dados iniciais de exemplo
