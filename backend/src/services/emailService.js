const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const { buildUserReport } = require('./analyticsService');
const prisma = new PrismaClient();

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Fallback: JSON transport (logs to console) for local dev
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function formatReportHtml(report) {
  const { user, water, electricity } = report;
  const section = (title, s) => {
    if (!s || !s.last) return `<h3>${title}</h3><p>Sem dados suficientes.</p>`;
    const last = `${s.last.month}/${s.last.year}`;
    const prev = s.prev ? `${s.prev.month}/${s.prev.year}` : '—';
    return `
      <h3>${title}</h3>
      <ul>
        <li>Último mês: ${last} — Consumo: <b>${s.last.consumption}</b></li>
        <li>Mês anterior: ${prev} ${s.prev ? `— Consumo: <b>${s.prev.consumption}</b>` : ''}</li>
        <li>Tendência: <b>${s.trend}</b> (${s.prev ? s.changePct + '%' : 'sem comparação'})</li>
      </ul>
    `;
  };

  return `
    <div>
      <h2>Relatório de Consumo — ${user.name}</h2>
      <p>Segue seu relatório de consumo mais recente:</p>
      ${section('Água', water)}
      ${section('Energia', electricity)}
      <p>Dica: mantenha o registro mensal atualizado para maximizar seus tokens!</p>
    </div>
  `;
}

async function sendUserReportEmail(userId) {
  const report = await buildUserReport(userId);
  if (!report) return;
  const transporter = getTransport();
  const from = process.env.SMTP_FROM || 'Relatórios <no-reply@example.com>';
  const to = report.user.email;
  const subject = 'Seu Relatório de Consumo';
  const html = formatReportHtml(report);
  const info = await transporter.sendMail({ from, to, subject, html });
  return info;
}

async function sendScheduledMonthlyReports() {
  const users = await prisma.user.findMany({ select: { id: true } });
  for (const u of users) {
    try { await sendUserReportEmail(u.id); } catch (_) {}
  }
}

module.exports = {
  sendUserReportEmail,
  sendScheduledMonthlyReports,
};
