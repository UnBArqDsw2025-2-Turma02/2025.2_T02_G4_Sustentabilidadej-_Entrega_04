import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Action Categories", () => {
  it("should list all action categories", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.actionCategories.list();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty("name");
    expect(categories[0]).toHaveProperty("description");
  });
});

describe("Action Types", () => {
  it("should list all action types", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const actionTypes = await caller.actionTypes.list();

    expect(Array.isArray(actionTypes)).toBe(true);
    expect(actionTypes.length).toBeGreaterThan(0);
    expect(actionTypes[0]).toHaveProperty("name");
    expect(actionTypes[0]).toHaveProperty("tokensReward");
    expect(actionTypes[0]).toHaveProperty("impactValue");
  });

  it("should filter action types by category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const actionTypes = await caller.actionTypes.byCategory({ categoryId: 1 });

    expect(Array.isArray(actionTypes)).toBe(true);
    actionTypes.forEach(action => {
      expect(action.categoryId).toBe(1);
    });
  });
});

describe("User Actions", () => {
  it("should return user stats", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.actions.stats();

    expect(stats).toHaveProperty("totalTokens");
    expect(stats).toHaveProperty("totalImpact");
    expect(stats).toHaveProperty("totalActions");
    expect(stats).toHaveProperty("level");
    expect(typeof stats.totalTokens).toBe("number");
  });

  it("should list user actions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const actions = await caller.actions.list();

    expect(Array.isArray(actions)).toBe(true);
  });
});

describe("Challenges", () => {
  it("should list active challenges", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const challenges = await caller.challenges.active();

    expect(Array.isArray(challenges)).toBe(true);
    expect(challenges.length).toBeGreaterThan(0);
    expect(challenges[0]).toHaveProperty("title");
    expect(challenges[0]).toHaveProperty("tokensReward");
  });

  it("should list user challenges", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const userChallenges = await caller.challenges.userChallenges();

    expect(Array.isArray(userChallenges)).toBe(true);
  });
});

describe("Products", () => {
  it("should list all products", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("tokensCost");
    expect(products[0]).toHaveProperty("stock");
  });

  it("should list user redemptions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const redemptions = await caller.products.myRedemptions();

    expect(Array.isArray(redemptions)).toBe(true);
  });
});

describe("Community", () => {
  it("should return community stats", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.community.stats();

    expect(stats).toHaveProperty("totalUsers");
    expect(stats).toHaveProperty("totalActions");
    expect(stats).toHaveProperty("totalImpact");
    expect(stats).toHaveProperty("totalTokensCirculating");
    expect(typeof stats.totalUsers).toBe("number");
  });

  it("should return top users", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const topUsers = await caller.community.topUsers({ limit: 10 });

    expect(Array.isArray(topUsers)).toBe(true);
    expect(topUsers.length).toBeLessThanOrEqual(10);
  });
});

describe("Notifications", () => {
  it("should list user notifications", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const notifications = await caller.notifications.list();

    expect(Array.isArray(notifications)).toBe(true);
  });

  it("should return unread count", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const count = await caller.notifications.unreadCount();

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

describe("Badges", () => {
  it("should list all badges", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const badges = await caller.badges.list();

    expect(Array.isArray(badges)).toBe(true);
    expect(badges.length).toBeGreaterThan(0);
    expect(badges[0]).toHaveProperty("name");
    expect(badges[0]).toHaveProperty("description");
  });

  it("should list user badges", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const userBadges = await caller.badges.userBadges();

    expect(Array.isArray(userBadges)).toBe(true);
  });
});
