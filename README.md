# API-Pay

Uma API para processar pagamentos com suporte a vários provedores.

## O que é este projeto

O projeto oferece uma solução completa para pagamentos online:

1. **Backend**: API para gerenciar pagamentos.
2. **Mock Providers**: Simuladores de gateways de pagamento para facilitar os testes.

## Como usar

### Instalação rápida

```bash

npm install
npm start
```

Esse comando inicia o backend e os simuladores de pagamento ao mesmo tempo.

### Instalação manual

```bash
# Para iniciar o backend
cd backend
npm install
npm run start

# Em outro terminal, para iniciar os simuladores
cd mock-providers
npm install
npm run start
```

- Backend: http://localhost:3001
- Documentação da API (Backend): http://localhost:3001/api-docs
- Documentação da API (Mock-Providers): http://localhost:3000/api-docs

## Como testar pagamentos

Para testar a API, use cartões com os seguintes padrões:

- Cartões terminados em 0 serão aprovados pelo primeiro provedor.
- Cartões terminados em 1 serão aprovados pelo segundo provedor.
- Cartões com outros finais serão recusados por ambos.

## Principais características

- Fallback automático: Se um provedor falhar, outro será tentado na sequência.
- Armazenamento temporário: As transações ficam salvas na memória enquanto o sistema está rodando.
- Formato único: Um só formato de comunicação, independentemente do provedor usado.

## Tecnologias usadas

- Node.js
- npm
- Express
- UUID para geração de identificadores únicos
- Armazenamento em memória
