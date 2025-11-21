import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== ACTION CATEGORIES ==========
  actionCategories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllActionCategories();
    }),
  }),

  // ========== ACTION TYPES ==========
  actionTypes: router({
    list: publicProcedure.query(async () => {
      return await db.getAllActionTypes();
    }),
    
    byCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getActionTypesByCategory(input.categoryId);
      }),
  }),

  // ========== USER ACTIONS ==========
  actions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserActions(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        actionTypeId: z.number(),
        notes: z.string().optional(),
        proofImage: z.string().optional(), // Base64 image
      }))
      .mutation(async ({ ctx, input }) => {
        // Buscar informações do tipo de ação
        const actionType = await db.getActionTypeById(input.actionTypeId);
        if (!actionType) {
          throw new Error("Tipo de ação não encontrado");
        }

        let proofUrl: string | null = null;

        // Se houver imagem de comprovante, fazer upload para S3
        if (input.proofImage) {
          const base64Data = input.proofImage.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const fileName = `proof-${ctx.user.id}-${Date.now()}.jpg`;
          const { url } = await storagePut(fileName, buffer, 'image/jpeg');
          proofUrl = url;
        }

        // Criar a ação do usuário
        await db.createUserAction({
          userId: ctx.user.id,
          actionTypeId: input.actionTypeId,
          tokensEarned: actionType.tokensReward,
          impactValue: actionType.impactValue,
          proofUrl,
          notes: input.notes,
          status: 'approved',
        });

        // Atualizar tokens e impacto do usuário
        await db.updateUserTokens(ctx.user.id, actionType.tokensReward);
        await db.updateUserImpact(ctx.user.id, actionType.impactValue);

        // Criar notificação
        await db.createNotification({
          userId: ctx.user.id,
          title: 'Ação Registrada!',
          message: `Você ganhou ${actionType.tokensReward} tokens por: ${actionType.name}`,
          type: 'achievement',
        });

        return { success: true, tokensEarned: actionType.tokensReward };
      }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      const actions = await db.getUserActions(ctx.user.id);
      
      return {
        totalTokens: user?.tokens || 0,
        totalImpact: user?.totalImpact || 0,
        totalActions: actions.length,
        level: user?.level || 1,
      };
    }),
  }),

  // ========== CHALLENGES ==========
  challenges: router({
    active: publicProcedure.query(async () => {
      return await db.getActiveChallenges();
    }),

    userChallenges: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserChallenges(ctx.user.id);
    }),

    join: protectedProcedure
      .input(z.object({ challengeId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Verificar se o usuário já está participando
        const existing = await db.getUserChallengeByIds(ctx.user.id, input.challengeId);
        if (existing) {
          throw new Error("Você já está participando deste desafio");
        }

        // Criar participação no desafio
        await db.createUserChallenge({
          userId: ctx.user.id,
          challengeId: input.challengeId,
          currentProgress: 0,
          isCompleted: false,
        });

        // Criar notificação
        const challenge = await db.getChallengeById(input.challengeId);
        await db.createNotification({
          userId: ctx.user.id,
          title: 'Novo Desafio Aceito!',
          message: `Você entrou no desafio: ${challenge?.title}`,
          type: 'challenge',
        });

        return { success: true };
      }),
  }),

  // ========== PRODUCTS ==========
  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),

    redeem: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        const product = await db.getProductById(input.productId);

        if (!user || !product) {
          throw new Error("Usuário ou produto não encontrado");
        }

        // Verificar se o usuário tem tokens suficientes
        if (user.tokens < product.tokensCost) {
          throw new Error("Tokens insuficientes");
        }

        // Verificar estoque
        if (product.stock <= 0) {
          throw new Error("Produto sem estoque");
        }

        // Gerar código de resgate
        const redemptionCode = `SUST-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // Criar resgate
        await db.createRedemption({
          userId: ctx.user.id,
          productId: input.productId,
          tokensSpent: product.tokensCost,
          status: 'pending',
          redemptionCode,
        });

        // Deduzir tokens do usuário
        await db.updateUserTokens(ctx.user.id, -product.tokensCost);

        // Atualizar estoque
        await db.updateProductStock(input.productId, -1);

        // Criar notificação
        await db.createNotification({
          userId: ctx.user.id,
          title: 'Resgate Realizado!',
          message: `Você resgatou: ${product.name}. Código: ${redemptionCode}`,
          type: 'system',
        });

        return { success: true, redemptionCode };
      }),

    myRedemptions: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserRedemptions(ctx.user.id);
    }),
  }),

  // ========== NOTIFICATIONS ==========
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),

    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUnreadNotificationsCount(ctx.user.id);
    }),
  }),

  // ========== COMMUNITY STATS ==========
  community: router({
    stats: publicProcedure.query(async () => {
      return await db.getCommunityStats();
    }),

    topUsers: publicProcedure
      .input(z.object({ limit: z.number().optional().default(10) }))
      .query(async ({ input }) => {
        return await db.getTopUsers(input.limit);
      }),
  }),

  // ========== BADGES ==========
  badges: router({
    list: publicProcedure.query(async () => {
      return await db.getAllBadges();
    }),

    userBadges: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserBadges(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
