const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { sendUserReportEmail } = require('../services/emailService');
const { buildUserReport } = require('../services/analyticsService');

const router = Router();

router.use(authMiddleware);

router.post('/send', async (req, res) => {
  try {
    const info = await sendUserReportEmail(req.userId);
    res.json({ ok: true, info });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao enviar relatório' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const report = await buildUserReport(req.userId);
    res.json(report);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
});

module.exports = router;
