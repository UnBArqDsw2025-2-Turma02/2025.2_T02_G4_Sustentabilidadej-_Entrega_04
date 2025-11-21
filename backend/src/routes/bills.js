const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { authMiddleware } = require('../middleware/auth');
const { getPreviousBill, computeImprovementTokens } = require('../services/analyticsService');
const { awardTokens } = require('../services/tokenService');

const prisma = new PrismaClient();
const router = Router();

const billSchema = z.object({
  type: z.enum(['WATER', 'ELECTRICITY']),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(3000),
  consumption: z.number().positive(),
  amount: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional(),
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const bills = await prisma.bill.findMany({
    where: { userId: Number(req.userId) },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });
  res.json(bills);
});

router.post('/', async (req, res) => {
  try {
    const parsed = billSchema.parse(req.body);
    const data = { ...parsed, userId: Number(req.userId) };
    const created = await prisma.bill.create({ data });

    // Award tokens if improved vs previous month of same type
    const prev = await getPreviousBill(req.userId, created.type, created.month, created.year);
    if (prev) {
      const tokens = computeImprovementTokens(prev.consumption, created.consumption);
      if (tokens > 0) {
        await awardTokens(req.userId, tokens, `Economia em ${created.month}/${created.year} (${created.type})`, created.id);
      }
    }

    res.status(201).json(created);
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
    if (e.code === 'P2002') return res.status(409).json({ error: 'Já existe conta para esse mês/tipo' });
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const parsed = billSchema.parse(req.body);
    // Ensure bill belongs to user
    const existing = await prisma.bill.findUnique({ where: { id } });
    if (!existing || existing.userId !== Number(req.userId)) return res.status(404).json({ error: 'Não encontrado' });

    const updated = await prisma.bill.update({ where: { id }, data: parsed });
    res.json(updated);
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
    console.error(e);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.bill.findUnique({ where: { id } });
    if (!existing || existing.userId !== Number(req.userId)) return res.status(404).json({ error: 'Não encontrado' });
    await prisma.bill.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao excluir' });
  }
});

module.exports = router;
