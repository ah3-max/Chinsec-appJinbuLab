import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";

// ----------------------------------------
// 擴充 NextAuth 型別：Session / User 附帶 role / locale
// JWT 型別於 callbacks 中以本地 interface 處理（避免 v5 子模組擴充的 TS 解析問題）
// ----------------------------------------
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
      uiLanguage: string;
      mustChangePassword: boolean;
      // Set by /api/admin/impersonate/consume — when present, the session is an
      // admin impersonating the user identified by `id`. The original admin's
      // user id lives here.
      _impersonatedBy?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    role: UserRole;
    uiLanguage: string;
    mustChangePassword: boolean;
  }
}

interface AppToken {
  id?: string;
  username?: string;
  role?: UserRole;
  uiLanguage?: string;
  mustChangePassword?: boolean;
  _impersonatedBy?: string;
  [key: string]: unknown;
}

const credentialsSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 天
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;
        const user = await db.user.findUnique({
          where: { username },
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            passwordHash: true,
            role: true,
            uiLanguage: true,
            status: true,
            avatarUrl: true,
            mustChangePassword: true,
          },
        });

        if (!user || user.status !== "ACTIVE") return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // 更新 lastActiveAt（不影響登入流程，失敗忽略）
        db.user
          .update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() },
          })
          .catch(() => {});

        return {
          id: user.id,
          name: user.fullName,
          email: user.email ?? undefined,
          image: user.avatarUrl ?? undefined,
          username: user.username,
          role: user.role,
          uiLanguage: user.uiLanguage,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as AppToken;
      if (user) {
        t.id = user.id as string;
        t.username = user.username;
        t.role = user.role;
        t.uiLanguage = user.uiLanguage;
        t.mustChangePassword = user.mustChangePassword;
        // `_impersonatedBy` is never set by the credentials provider — only by
        // the impersonate consume route, which writes the JWT cookie directly.
        // Existing values flow through naturally on subsequent requests
        // (when `user` is undefined).
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as AppToken;
      session.user.id = t.id ?? "";
      session.user.username = t.username ?? "";
      if (t.role) session.user.role = t.role;
      session.user.uiLanguage = t.uiLanguage ?? "zh-TW";
      session.user.mustChangePassword = t.mustChangePassword ?? false;
      if (t._impersonatedBy) {
        session.user._impersonatedBy = t._impersonatedBy;
      }
      return session;
    },
  },
  trustHost: true,
});
