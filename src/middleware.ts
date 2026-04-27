import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "@/i18n/routing";
import { authCookieName } from "@/lib/cookie-name";

const intlMiddleware = createIntlMiddleware(routing);

// 不需登入即可造訪的路徑（已含 /[locale] 前綴後綴的判斷）
const PUBLIC_PATHS = ["/login", "/forgot-password"];

// 即使 mustChangePassword=true 也可以造訪的路徑：登出 / 改密碼頁本身。
const CHANGE_PASSWORD_WHITELIST = ["/login", "/change-password"];

function localeStrip(pathname: string): {
  rest: string;
  locale: string;
  hasLocalePrefix: boolean;
} {
  const segments = pathname.split("/").filter(Boolean);
  const localeMaybe = segments[0];
  const hasLocalePrefix = (routing.locales as readonly string[]).includes(
    localeMaybe ?? "",
  );
  const rest =
    "/" + (hasLocalePrefix ? segments.slice(1) : segments).join("/");
  return {
    rest,
    locale: hasLocalePrefix ? (localeMaybe as string) : routing.defaultLocale,
    hasLocalePrefix,
  };
}

function isPublic(rest: string): boolean {
  if (rest === "/") return true;
  return PUBLIC_PATHS.some((p) => rest === p || rest.startsWith(p + "/"));
}

function isChangePasswordWhitelisted(rest: string): boolean {
  return CHANGE_PASSWORD_WHITELIST.some(
    (p) => rest === p || rest.startsWith(p + "/"),
  );
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. 多語系處理
  const intlResponse = intlMiddleware(req);

  // 2. API / 靜態資源直接放行
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return intlResponse;
  }

  const { rest, locale } = localeStrip(pathname);

  // 3. 公開路徑放行
  if (isPublic(rest)) {
    return intlResponse;
  }

  // 4. 受保護路徑檢查 NextAuth session cookie
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. mustChangePassword 強制導向（不騷擾 impersonating 中的管理員）
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      salt: authCookieName(),
    });
    if (
      token?.mustChangePassword &&
      !token._impersonatedBy &&
      !isChangePasswordWhitelisted(rest)
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/change-password`, req.url),
      );
    }
  } catch {
    // Token decode failed — let downstream pages handle re-auth.
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
