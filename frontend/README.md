# Frontend — Consumo Sustentável

Aplicação React + Vite com autenticação simples e consumo da API.

## Configuração

1. Instale Node.js LTS (>=18)
2. Instale dependências:

```
npm install
```

3. Opcional: crie `.env` e defina `VITE_API_URL` (padrão: `http://localhost:3001`).

## Executar (dev)

```
npm run dev
```

App em `http://localhost:5173`.

Fluxos:
- Cadastro e login
- Painel: últimas contas, saldo e extrato de tokens
- Adicionar conta (água/energia)
- Enviar relatório por e-mail (botão no painel)
