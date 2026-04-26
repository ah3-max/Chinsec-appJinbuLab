import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// 不需登入即可造訪的路徑（已含 /[locale] 前綴後綴的判斷）
const PUBLIC_PATHS = ["/login", "/forgot-password"];

function isPublic(pathname: string): boolean {
  // 移除 locale 前綴後比對：/zh-TW/login → /login
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true; // 根路徑由 intl middleware 導向預設 locale
  const localeMaybe = segments[0];
  const isLocalePrefixed = (routing.locales as readonly string[]).includes(
    localeMaybe ?? "",
  );
  const rest = "/" + (isLocalePrefixed ? segments.slice(1) : segments).join("/");
  return PUBLIC_PATHS.some((p) => rest === p || rest.startsWith(p + "/"));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. 多語系處理（補 locale 前綴、語言偵測）
  const intlResponse = intlMiddleware(req);

  // 2. 若是 API / 靜態資源，直接放行
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return intlResponse;
  }

  // 3. 公開路徑放行
  if (isPublic(pathname)) {
    return intlResponse;
  }

  // 4. 受保護路徑檢查 NextAuth session cookie
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionCookie) {
    // 未登入 → 導向 /[locale]/login
    const segments = pathname.split("/").filter(Boolean);
    const locale =
      (routing.locales as readonly string[]).includes(segments[0] ?? "")
        ? segments[0]
        : routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  // 排除靜態資源 / API 之外，全部走 middleware
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
