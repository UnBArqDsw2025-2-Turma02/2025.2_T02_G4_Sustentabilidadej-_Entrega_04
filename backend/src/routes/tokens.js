const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getUserTokenBalance, getUserTokenLedger } = require('../services/tokenService');

const router = Router();

router.use(authMiddleware);

router.get('/balance', async (req, res) => {
  const balance = await getUserTokenBalance(req.userId);
  res.json({ balance });
});

router.get('/ledger', async (req, res) => {
  const ledger = await getUserTokenLedger(req.userId, 200);
  res.json(ledger);
});

module.exports = router;
