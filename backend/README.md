# Backend — Consumo Sustentável

API Node.js com Express, Prisma (SQLite), JWT, envio de e-mail (Nodemailer) e cron (node-cron).

## Configuração

1. Instale Node.js LTS (>=18)
2. Copie `.env.example` para `.env` e ajuste variáveis (opcional; por padrão e-mails são logados no console)
3. Instale dependências e gere Prisma Client

```
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Executar em desenvolvimento

```
npm run dev
```

API em `http://localhost:3001`.

Endpoints principais:
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/bills` (auth)
- POST `/api/bills` (auth) { type: 'WATER'|'ELECTRICITY', month, year, consumption, amount?, notes? }
- PUT `/api/bills/:id` (auth)
- DELETE `/api/bills/:id` (auth)
- POST `/api/reports/send` (auth) — envia relatório por e-mail
- GET `/api/tokens/balance` (auth)
- GET `/api/tokens/ledger` (auth)

Agendamento de relatórios: controlado por `REPORT_CRON_SCHEDULE` (padrão: "0 8 1 * *").

## Notas

- Tokens são concedidos ao cadastrar uma conta com consumo menor que o do mês anterior do mesmo tipo. Regra: 1 token por ponto percentual de economia (mínimo 1).
- Para e-mails reais, configure SMTP_* no `.env`. Sem SMTP, as mensagens aparecem no console.
