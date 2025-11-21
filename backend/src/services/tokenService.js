const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function awardTokens(userId, amount, reason, billId = null) {
  if (!amount || amount <= 0) return null;
  return prisma.tokenLedger.create({
    data: { userId: Number(userId), amount: Math.floor(amount), reason, billId },
  });
}

async function getUserTokenBalance(userId) {
  const agg = await prisma.tokenLedger.aggregate({
    where: { userId: Number(userId) },
    _sum: { amount: true },
  });
  return agg._sum.amount || 0;
}

async function getUserTokenLedger(userId, limit = 100) {
  return prisma.tokenLedger.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

module.exports = { awardTokens, getUserTokenBalance, getUserTokenLedger };
