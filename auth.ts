import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { PLAN_COPY } from "@/lib/billing/plans";
import { getQuotaSnapshotForUser } from "@/lib/billing/searchQuota";
import { prisma } from "@/lib/prisma";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ?? "build-time-placeholder.apps.googleusercontent.com";
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? "build-time-placeholder";

const devEmail =
  process.env.NODE_ENV === "development"
    ? Credentials({
        id: "dev-email",
        name: "Email (solo desarrollo)",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "demo@openspot.dev",
          },
        },
        async authorize(credentials) {
          const email = (credentials?.email as string | undefined)
            ?.trim()
            .toLowerCase();
          if (!email?.includes("@")) return null;
          return prisma.user.upsert({
            where: { email },
            create: {
              email,
              emailVerified: new Date(),
              name: email.split("@")[0] ?? "Usuario",
            },
            update: { name: email.split("@")[0] ?? undefined },
          });
        },
      })
    : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 60 * 60,
    updateAge: 12 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    ...(devEmail ? [devEmail] : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user || !token.sub) return session;

      try {
        const u = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { creditWallet: true, subscription: true },
        });
        if (!u) {
          session.user.id = token.sub;
          return session;
        }

        session.user.id = u.id;
        session.user.name = u.name ?? "";
        session.user.email = u.email ?? "";
        session.user.image = u.image ?? null;
        session.user.planTier = u.planTier;
        session.user.phone = u.phone;
        session.user.company = u.company;
        session.user.bio = u.bio;

        session.user.planLabel =
          u.planTier === "free"
            ? PLAN_COPY.free.label
            : u.planTier === "pro"
              ? PLAN_COPY.pro.label
              : PLAN_COPY.enterprise.label;

        const snap = await getQuotaSnapshotForUser(u.id);
        session.user.quotaHeadline = snap?.headline ?? "—";

        session.user.stripeCustomerId = u.subscription?.stripeCustomerId ?? null;
        session.user.subscriptionStatus = u.subscription?.status ?? null;
      } catch (e) {
        console.error("auth session enrich:", e);
        session.user.id = token.sub;
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.creditWallet
        .create({
          data: { userId: user.id!, balance: 3 },
        })
        .catch(() => undefined);
    },
  },
});
