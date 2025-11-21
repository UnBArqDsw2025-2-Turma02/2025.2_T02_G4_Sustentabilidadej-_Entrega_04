import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // Provide a mock user in development to avoid auth redirects and enable protected routes
  if (!user && process.env.NODE_ENV === "development") {
    user = {
      id: 1,
      openId: "local-user-123",
      name: "Gustavo Teste",
      email: "gustavo@teste.com",
      loginMethod: "local",
      role: "admin",
      tokens: 100,
      totalImpact: 5000,
      level: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as unknown as User;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
