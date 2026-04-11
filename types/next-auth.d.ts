import type { DefaultSession } from "next-auth";
import type { PlanTier } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      planTier?: PlanTier;
      planLabel?: string;
      quotaHeadline?: string;
      phone?: string | null;
      company?: string | null;
      bio?: string | null;
      stripeCustomerId?: string | null;
      subscriptionStatus?: string | null;
    };
  }
}
