# Consumo Sustentável — Como rodar o site

Este repositório agora inclui um site completo (frontend + backend) para registrar contas de água e energia, analisar consumo, enviar relatórios por e-mail e premiar com tokens quando houver economia.

## Requisitos
- Linux com Bash
- Node.js LTS (>= 18). Se não tiver, instale rapidamente com NVM:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm install --lts && nvm use --lts
```

## Backend (API)

```bash
cd backend
cp .env.example .env   # opcional (há um .env de dev com defaults)
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
# API: http://localhost:3001
```

Principais endpoints:
- POST /api/auth/register { name, email, password }
- POST /api/auth/login { email, password }
- GET /api/bills (autenticado)
- POST /api/bills (autenticado)
- POST /api/reports/send (autenticado)
- GET /api/tokens/balance (autenticado)
- GET /api/tokens/ledger (autenticado)

Notas:
- Sem SMTP configurado, os e-mails são logados no console (JSON transport).
- O envio automático mensal é controlado por `REPORT_CRON_SCHEDULE` no `.env` (padrão: dia 1 às 08:00).

## Frontend (App Web)

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

Durante o desenvolvimento, o app consome a API em `http://localhost:3001`. Para alterar, crie `frontend/.env` com:

```
VITE_API_URL=http://seu-backend:3001
```

## Fluxo básico
1. Acesse o app, crie sua conta (Cadastro) e faça login.
2. Adicione suas contas mensais (água/energia). Se houver economia vs o mês anterior do mesmo tipo, você ganha tokens automaticamente.
3. No Dashboard, veja saldo/extrato de tokens e suas últimas contas.
4. Envie um relatório por e-mail quando quiser (botão no Dashboard) ou aguarde o envio automático mensal.

## Guias adicionais
- Passo a passo detalhado: veja `RUNNING.md`.
- Detalhes da API: `backend/README.md`. Detalhes do frontend: `frontend/README.md`.

---

# Repositório de Documentação (Docsify)

O template original do repositório utiliza [docsify](https://docsify.js.org/) para documentação estática.

```shell
"Docsify generates your documentation website on the fly. Unlike GitBook, it does not generate static html files. Instead, it smartly loads and parses your Markdown files and displays them as a website. To start using it, all you need to do is create an index.html and deploy it on GitHub Pages."
```

### Instalando o docsify (opcional)

```shell
npm i docsify-cli -g
```

### Executando a documentação localmente (opcional)

```shell
docsify serve ./docs
```
