const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function prevMonthYear(month, year) {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
}

async function getPreviousBill(userId, type, month, year) {
  const { month: pm, year: py } = prevMonthYear(month, year);
  return prisma.bill.findUnique({
    where: {
      userId_type_year_month: {
        userId: Number(userId),
  type,
        year: py,
        month: pm,
      },
    },
  });
}

function computeImprovementTokens(prevConsumption, currentConsumption) {
  if (!prevConsumption || prevConsumption <= 0) return 0;
  const delta = prevConsumption - currentConsumption;
  if (delta <= 0) return 0;
  const pct = (delta / prevConsumption) * 100;
  return Math.max(1, Math.floor(pct)); // 1 token por cada ponto percentual salvo (arredondado para baixo), mínimo 1
}

async function buildUserReport(userId) {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) return null;

  const bills = await prisma.bill.findMany({
    where: { userId: Number(userId) },
    orderBy: [{ type: 'asc' }, { year: 'asc' }, { month: 'asc' }],
  });

  const grouped = { WATER: [], ELECTRICITY: [] };
  for (const b of bills) grouped[b.type].push(b);

  function summarize(list) {
    if (list.length === 0) return { last: null, prev: null, trend: 'sem dados', changePct: 0 };
    const last = list[list.length - 1];
    const prev = list.length > 1 ? list[list.length - 2] : null;
    const changePct = prev ? ((last.consumption - prev.consumption) / prev.consumption) * 100 : 0;
    const trend = prev ? (changePct < 0 ? 'economia' : changePct > 0 ? 'aumento' : 'estável') : 'sem comparação';
    return { last, prev, trend, changePct: Math.round(changePct * 10) / 10 };
  }

  const water = summarize(grouped.WATER);
  const electricity = summarize(grouped.ELECTRICITY);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    water,
    electricity,
  };
}

module.exports = {
  getPreviousBill,
  computeImprovementTokens,
  buildUserReport,
};
