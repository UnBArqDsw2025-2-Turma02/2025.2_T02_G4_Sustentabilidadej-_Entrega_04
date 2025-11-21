import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Campos específicos do SustentabilidadeJá
  tokens: int("tokens").default(0).notNull(), // Saldo de tokens do usuário
  totalImpact: int("totalImpact").default(0).notNull(), // Impacto total acumulado
  level: int("level").default(1).notNull(), // Nível do usuário
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categorias de ações sustentáveis
 */
export const actionCategories = mysqlTable("actionCategories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // Nome do ícone (ex: "leaf", "recycle")
  color: varchar("color", { length: 7 }), // Cor em hex
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActionCategory = typeof actionCategories.$inferSelect;
export type InsertActionCategory = typeof actionCategories.$inferInsert;

/**
 * Tipos de ações sustentáveis específicas
 */
export const actionTypes = mysqlTable("actionTypes", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  tokensReward: int("tokensReward").notNull(), // Tokens ganhos por esta ação
  impactValue: int("impactValue").notNull(), // Valor de impacto (ex: CO2 economizado em gramas)
  impactUnit: varchar("impactUnit", { length: 50 }), // Unidade de medida (kg, litros, etc)
  requiresProof: boolean("requiresProof").default(false).notNull(), // Requer comprovante/foto
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActionType = typeof actionTypes.$inferSelect;
export type InsertActionType = typeof actionTypes.$inferInsert;

/**
 * Ações sustentáveis registradas pelos usuários
 */
export const userActions = mysqlTable("userActions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  actionTypeId: int("actionTypeId").notNull(),
  tokensEarned: int("tokensEarned").notNull(),
  impactValue: int("impactValue").notNull(), // Impacto calculado desta ação específica
  proofUrl: varchar("proofUrl", { length: 500 }), // URL da foto de comprovante (opcional)
  notes: text("notes"), // Observações do usuário
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("approved").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserAction = typeof userActions.$inferSelect;
export type InsertUserAction = typeof userActions.$inferInsert;

/**
 * Desafios disponíveis no sistema
 */
export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  tokensReward: int("tokensReward").notNull(),
  targetValue: int("targetValue").notNull(), // Valor alvo (ex: 10 ações, 500g CO2)
  targetUnit: varchar("targetUnit", { length: 50 }), // Unidade do alvo
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

/**
 * Participação dos usuários em desafios
 */
export const userChallenges = mysqlTable("userChallenges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeId: int("challengeId").notNull(),
  currentProgress: int("currentProgress").default(0).notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = typeof userChallenges.$inferInsert;

/**
 * Produtos disponíveis no marketplace
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  tokensCost: int("tokensCost").notNull(),
  category: varchar("category", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  stock: int("stock").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isEcoFriendly: boolean("isEcoFriendly").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Resgates de produtos pelos usuários
 */
export const redemptions = mysqlTable("redemptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  tokensCost: int("tokensCost").notNull(),
  redemptionCode: varchar("redemptionCode", { length: 50 }).unique().notNull(),
  status: mysqlEnum("status", ["pending", "delivered", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  deliveredAt: timestamp("deliveredAt"),
});

export type Redemption = typeof redemptions.$inferSelect;
export type InsertRedemption = typeof redemptions.$inferInsert;

/**
 * Notificações do sistema
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["achievement", "reminder", "system"]).default("system").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Badges/conquistas do sistema
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  iconUrl: varchar("iconUrl", { length: 500 }),
  rarity: mysqlEnum("rarity", ["common", "rare", "epic", "legendary"]).default("common").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * Badges conquistados pelos usuários
 */
export const userBadges = mysqlTable("userBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: int("badgeId").notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;
