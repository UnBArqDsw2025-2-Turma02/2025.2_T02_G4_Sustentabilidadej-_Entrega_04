import { eq, desc, and, sql, gte, lte, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
// Ajuste: separar imports de tipos para evitar erro de runtime (Node tentando importar tipos que não existem em JS)
import {
  users,
  actionCategories,
  actionTypes,
  userActions,
  challenges,
  userChallenges,
  products,
  redemptions,
  notifications,
  badges,
  userBadges
} from "../drizzle/schema";
import type {
  InsertUser,
  InsertActionCategory,
  InsertActionType,
  InsertUserAction,
  InsertChallenge,
  InsertUserChallenge,
  InsertProduct,
  InsertRedemption,
  InsertNotification,
  InsertBadge,
  InsertUserBadge
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Fallback em memória quando o banco não estiver disponível (ambiente de desenvolvimento)
const _memUsers = new Map<number, { tokens: number; totalImpact: number; level: number }>();
let _memActionId = 1;
const _memActions: Array<{
  id: number;
  userId: number;
  actionTypeId: number;
  tokensEarned: number;
  impactValue: number;
  proofUrl: string | null;
  notes: string | null;
  status: 'approved';
  createdAt: Date;
  actionTypeName: string | null;
  actionTypeDescription: string | null;
  categoryName: string | null;
}> = [];

export async function getDb() {
  // Em desenvolvimento, ignore erro de conexão com banco
  if (!_db && process.env.DATABASE_URL && process.env.NODE_ENV !== "development") {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ========== USER FUNCTIONS ==========

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) {
    const mem = _memUsers.get(userId) || { tokens: 0, totalImpact: 0, level: 1 };
    return { id: userId, name: 'Usuário', tokens: mem.tokens, totalImpact: mem.totalImpact, level: mem.level } as any;
  }

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserTokens(userId: number, tokensToAdd: number) {
  const db = await getDb();
  if (!db) {
    const mem = _memUsers.get(userId) || { tokens: 0, totalImpact: 0, level: 1 };
    mem.tokens += tokensToAdd;
    _memUsers.set(userId, mem);
    return;
  }

  await db.update(users)
    .set({
      tokens: sql`${users.tokens} + ${tokensToAdd}`,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

export async function updateUserImpact(userId: number, impactToAdd: number) {
  const db = await getDb();
  if (!db) {
    const mem = _memUsers.get(userId) || { tokens: 0, totalImpact: 0, level: 1 };
    mem.totalImpact += impactToAdd;
    _memUsers.set(userId, mem);
    return;
  }

  await db.update(users)
    .set({
      totalImpact: sql`${users.totalImpact} + ${impactToAdd}`,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

// ========== ACTION CATEGORIES ==========

export async function getAllActionCategories() {
  const db = await getDb();
  if (!db) {
    // Dados mockados para desenvolvimento
    if (process.env.NODE_ENV === "development") {
      return [
        { id: 1, name: "Reciclagem", description: "Reciclagem e reutilização de materiais", icon: "recycle", color: "#22c55e", createdAt: new Date() },
        { id: 2, name: "Energia", description: "Economia e eficiência energética", icon: "zap", color: "#eab308", createdAt: new Date() },
        { id: 3, name: "Transporte", description: "Transporte sustentável e mobilidade", icon: "bus", color: "#3b82f6", createdAt: new Date() },
        { id: 4, name: "Água", description: "Conservação e uso consciente da água", icon: "droplet", color: "#06b6d4", createdAt: new Date() },
        { id: 5, name: "Consumo", description: "Consumo consciente e sustentável", icon: "shopping-bag", color: "#8b5cf6", createdAt: new Date() },
      ];
    }
    return [];
  }

  return await db.select().from(actionCategories);
}

export async function createActionCategory(category: InsertActionCategory) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(actionCategories).values(category);
  return result;
}

// ========== ACTION TYPES ==========

export async function getAllActionTypes() {
  const db = await getDb();
  if (!db) {
    // Dados mockados para desenvolvimento
    if (process.env.NODE_ENV === "development") {
      return [
        { id: 1, categoryId: 1, name: "Reciclar papel", description: "Separar e reciclar papel usado", tokensReward: 10, impactValue: 500, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 2, categoryId: 1, name: "Reciclar plástico", description: "Separar e reciclar plástico", tokensReward: 15, impactValue: 800, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 3, categoryId: 2, name: "Usar lâmpada LED", description: "Trocar lâmpadas por LED", tokensReward: 25, impactValue: 1200, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 4, categoryId: 3, name: "Usar transporte público", description: "Utilizar transporte público em vez de carro", tokensReward: 20, impactValue: 2000, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 5, categoryId: 4, name: "Economizar água", description: "Reduzir o consumo de água", tokensReward: 15, impactValue: 10, impactUnit: "litros", requiresProof: false, isActive: true, createdAt: new Date() },
      ];
    }
    return [];
  }

  return await db.select().from(actionTypes).where(eq(actionTypes.isActive, true));
}

export async function getActionTypeById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(actionTypes).where(eq(actionTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getActionTypesByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) {
    // Dados mockados para desenvolvimento
    if (process.env.NODE_ENV === "development") {
      const allActions = [
        { id: 1, categoryId: 1, name: "Reciclar papel", description: "Separar e reciclar papel usado", tokensReward: 10, impactValue: 500, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 2, categoryId: 1, name: "Reciclar plástico", description: "Separar e reciclar plástico", tokensReward: 15, impactValue: 800, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 3, categoryId: 2, name: "Usar lâmpada LED", description: "Trocar lâmpadas por LED", tokensReward: 25, impactValue: 1200, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 4, categoryId: 3, name: "Usar transporte público", description: "Utilizar transporte público em vez de carro", tokensReward: 20, impactValue: 2000, impactUnit: "g CO2", requiresProof: false, isActive: true, createdAt: new Date() },
        { id: 5, categoryId: 4, name: "Economizar água", description: "Reduzir o consumo de água", tokensReward: 15, impactValue: 10, impactUnit: "litros", requiresProof: false, isActive: true, createdAt: new Date() },
      ];
      return allActions.filter(action => action.categoryId === categoryId);
    }
    return [];
  }

  return await db.select()
    .from(actionTypes)
    .where(and(
      eq(actionTypes.categoryId, categoryId),
      eq(actionTypes.isActive, true)
    ));
}

export async function createActionType(actionType: InsertActionType) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(actionTypes).values(actionType);
  return result;
}

// ========== USER ACTIONS ==========

export async function createUserAction(action: InsertUserAction) {
  const db = await getDb();
  if (!db) {
    const actionType = await getActionTypeById(action.actionTypeId);
    const categories = await getAllActionCategories();
    const categoryName = categories.find((c: any) => c.id === actionType?.categoryId)?.name || null;
    _memActions.push({
      id: _memActionId++,
      userId: action.userId,
      actionTypeId: action.actionTypeId,
      tokensEarned: action.tokensEarned,
      impactValue: action.impactValue,
      proofUrl: action.proofUrl ?? null,
      notes: action.notes ?? null,
      status: 'approved',
      createdAt: new Date(),
      actionTypeName: actionType?.name ?? null,
      actionTypeDescription: actionType?.description ?? null,
      categoryName,
    });
    return { success: true } as any;
  }

  const result = await db.insert(userActions).values(action);
  return result;
}

export async function getUserActions(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    // se ainda não houver ações do usuário na memória, semear 3 ações padrão (compatível com UI atual)
    let actions = _memActions.filter(a => a.userId === userId);
    if (actions.length === 0) {
      const defaults = [
        { actionTypeId: 1, tokensEarned: 10, impactValue: 500, notes: 'Reciclei uma pilha de papéis do escritório', atName: 'Reciclar papel', atDesc: 'Separar e reciclar papel usado', catName: 'Reciclagem' },
        { actionTypeId: 3, tokensEarned: 25, impactValue: 1200, notes: null as string | null, atName: 'Usar lâmpada LED', atDesc: 'Trocar lâmpadas por LED', catName: 'Energia' },
        { actionTypeId: 4, tokensEarned: 20, impactValue: 2000, notes: 'Fui ao trabalho de ônibus hoje', atName: 'Usar transporte público', atDesc: 'Utilizar transporte público em vez de carro', catName: 'Transporte' },
      ];
      defaults.forEach((d, idx) => {
        _memActions.push({
          id: _memActionId++,
          userId,
          actionTypeId: d.actionTypeId,
          tokensEarned: d.tokensEarned,
          impactValue: d.impactValue,
          proofUrl: null,
          notes: d.notes,
          status: 'approved',
          createdAt: new Date(Date.now() - (idx + 1) * 24 * 60 * 60 * 1000),
          actionTypeName: d.atName,
          actionTypeDescription: d.atDesc,
          categoryName: d.catName,
        });
      });
      const mem = _memUsers.get(userId) || { tokens: 0, totalImpact: 0, level: 1 };
      mem.tokens += defaults.reduce((s, d) => s + d.tokensEarned, 0);
      mem.totalImpact += defaults.reduce((s, d) => s + d.impactValue, 0);
      _memUsers.set(userId, mem);
      actions = _memActions.filter(a => a.userId === userId);
    }
    return actions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }

  return await db.select({
    id: userActions.id,
    userId: userActions.userId,
    actionTypeId: userActions.actionTypeId,
    tokensEarned: userActions.tokensEarned,
    impactValue: userActions.impactValue,
    proofUrl: userActions.proofUrl,
    notes: userActions.notes,
    status: userActions.status,
    createdAt: userActions.createdAt,
    actionTypeName: actionTypes.name,
    actionTypeDescription: actionTypes.description,
    categoryName: actionCategories.name,
  })
    .from(userActions)
    .leftJoin(actionTypes, eq(userActions.actionTypeId, actionTypes.id))
    .leftJoin(actionCategories, eq(actionTypes.categoryId, actionCategories.id))
    .where(eq(userActions.userId, userId))
    .orderBy(desc(userActions.createdAt))
    .limit(limit);
}

export async function getUserActionsInPeriod(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(userActions)
    .where(and(
      eq(userActions.userId, userId),
      gte(userActions.createdAt, startDate),
      lte(userActions.createdAt, endDate)
    ))
    .orderBy(desc(userActions.createdAt));
}

// ========== CHALLENGES ==========

export async function getActiveChallenges() {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return await db.select()
    .from(challenges)
    .where(and(
      eq(challenges.isActive, true),
      lte(challenges.startDate, now),
      gte(challenges.endDate, now)
    ))
    .orderBy(desc(challenges.createdAt));
}

export async function getChallengeById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createChallenge(challenge: InsertChallenge) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(challenges).values(challenge);
  return result;
}

// ========== USER CHALLENGES ==========

export async function getUserChallenges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    id: userChallenges.id,
    userId: userChallenges.userId,
    challengeId: userChallenges.challengeId,
    currentProgress: userChallenges.currentProgress,
    isCompleted: userChallenges.isCompleted,
    completedAt: userChallenges.completedAt,
    createdAt: userChallenges.joinedAt, // ajuste: tabela tem 'joinedAt' em vez de 'createdAt'
    challengeTitle: challenges.title,
    challengeDescription: challenges.description,
    challengeType: challenges.difficulty, // ajuste: coluna 'type' não existe; usar 'difficulty'
    targetValue: challenges.targetValue,
    tokensReward: challenges.tokensReward,
    endDate: challenges.endDate,
  })
    .from(userChallenges)
    .leftJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .where(eq(userChallenges.userId, userId))
    .orderBy(desc(userChallenges.joinedAt)); // ajuste: ordenar por joinedAt
}

export async function getUserChallengeByIds(userId: number, challengeId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select()
    .from(userChallenges)
    .where(and(
      eq(userChallenges.userId, userId),
      eq(userChallenges.challengeId, challengeId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createUserChallenge(userChallenge: InsertUserChallenge) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(userChallenges).values(userChallenge);
  return result;
}

export async function updateChallengeProgress(userId: number, challengeId: number, progress: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(userChallenges)
    .set({
      currentProgress: progress
    })
    .where(and(
      eq(userChallenges.userId, userId),
      eq(userChallenges.challengeId, challengeId)
    ));
}

export async function completeChallengeForUser(userId: number, challengeId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(userChallenges)
    .set({
      isCompleted: true,
      completedAt: new Date()
    })
    .where(and(
      eq(userChallenges.userId, userId),
      eq(userChallenges.challengeId, challengeId)
    ));
}

// ========== PRODUCTS ==========

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(products).values(product);
  return result;
}

export async function updateProductStock(productId: number, quantity: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(products)
    .set({
      stock: sql`${products.stock} + ${quantity}`
    })
    .where(eq(products.id, productId));
}

// ========== REDEMPTIONS ==========

export async function createRedemption(redemption: InsertRedemption) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(redemptions).values(redemption);
  return result;
}

export async function getUserRedemptions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    id: redemptions.id,
    userId: redemptions.userId,
    productId: redemptions.productId,
    tokensSpent: redemptions.tokensCost, // ajuste: coluna é tokensCost
    status: redemptions.status,
    redemptionCode: redemptions.redemptionCode,
    createdAt: redemptions.createdAt,
    updatedAt: redemptions.deliveredAt, // ajuste: não existe updatedAt, usar deliveredAt para manter chave
    productName: products.name,
    productImage: products.imageUrl,
  })
    .from(redemptions)
    .leftJoin(products, eq(redemptions.productId, products.id))
    .where(eq(redemptions.userId, userId))
    .orderBy(desc(redemptions.createdAt));
}

// ========== NOTIFICATIONS ==========

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getUserNotifications(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

export async function getUnreadNotificationsCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ));

  return result[0]?.count || 0;
}

// ========== BADGES ==========

export async function getAllBadges() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(badges);
}

export async function createBadge(badge: InsertBadge) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(badges).values(badge);
  return result;
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    id: userBadges.id,
    userId: userBadges.userId,
    badgeId: userBadges.badgeId,
    earnedAt: userBadges.earnedAt,
    badgeName: badges.name,
    badgeDescription: badges.description,
    badgeIcon: badges.iconUrl, // ajuste: coluna é iconUrl
  })
    .from(userBadges)
    .leftJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.earnedAt));
}

export async function awardBadgeToUser(userId: number, badgeId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(userBadges).values({
    userId,
    badgeId,
  });
  return result;
}

// ========== STATISTICS ==========

export async function getCommunityStats() {
  const db = await getDb();
  if (!db) {
    // Dados mockados para desenvolvimento
    if (process.env.NODE_ENV === "development") {
      return {
        totalUsers: 1250,
        totalActions: 5674,
        totalImpact: 87300, // em gramas de CO2
        totalTokensCirculating: 15420,
      };
    }
    return null;
  }

  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
  const totalActions = await db.select({ count: sql<number>`count(*)` }).from(userActions);
  const totalImpact = await db.select({ total: sql<number>`COALESCE(sum(${users.totalImpact}), 0)` }).from(users);
  const totalTokens = await db.select({ total: sql<number>`COALESCE(sum(${users.tokens}), 0)` }).from(users);

  return {
    totalUsers: totalUsers[0]?.count || 0,
    totalActions: totalActions[0]?.count || 0,
    totalImpact: totalImpact[0]?.total || 0,
    totalTokensCirculating: totalTokens[0]?.total || 0,
  };
}

export async function getTopUsers(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    if (process.env.NODE_ENV === "development") {
      const list = [
        { id: 1, name: "Gustavo Teste", totalImpact: 3700, tokens: 55, level: 1 },
        { id: 2, name: "Ana Silva", totalImpact: 5200, tokens: 78, level: 2 },
        { id: 3, name: "João Santos", totalImpact: 4800, tokens: 72, level: 2 },
        { id: 4, name: "Maria Oliveira", totalImpact: 4300, tokens: 65, level: 1 },
        { id: 5, name: "Pedro Costa", totalImpact: 3900, tokens: 58, level: 1 },
      ];
      return list
        .sort((a, b) => (b.tokens ?? 0) - (a.tokens ?? 0) || (b.totalImpact ?? 0) - (a.totalImpact ?? 0))
        .slice(0, limit);
    }
    return [];
  }

  return await db.select({
    id: users.id,
    name: users.name,
    totalImpact: users.totalImpact,
    tokens: users.tokens,
    level: users.level,
  })
    .from(users)
    .orderBy(
      desc(users.tokens),
      desc(users.totalImpact)
    )
    .limit(limit);
}
