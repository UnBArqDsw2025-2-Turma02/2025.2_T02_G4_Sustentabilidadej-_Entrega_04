# Como executar o projeto (Backend + Frontend)

Este guia explica como subir a API e o app web localmente.

## Pré-requisitos
- Node.js LTS (>= 18)

## Backend

```
cd backend
cp .env.example .env   # opcional, já existe um .env de dev
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

API: http://localhost:3001

## Frontend

Em outro terminal:

```
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## SMTP (opcional)
Para enviar e-mails de verdade, edite `backend/.env` com as credenciais SMTP. Sem SMTP configurado, os e-mails de relatório são logados no console (JSON transport).

## Agendamento de relatórios
Por padrão, o cron envia relatórios no dia 1 de cada mês às 08:00. Ajuste `REPORT_CRON_SCHEDULE` no `backend/.env` conforme necessário.