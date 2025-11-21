const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const billsRoutes = require('./routes/bills');
const reportsRoutes = require('./routes/reports');
const tokensRoutes = require('./routes/tokens');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/tokens', tokensRoutes);

module.exports = app;
