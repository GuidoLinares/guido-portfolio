import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/lib/locales";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Elige el locale con mayor q-value que tenga soporte. Parser propio: no vale
 * la pena una dependencia para dos locales.
 */
function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) {
    return null;
  }

  const ranked = header
    .split(",")
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().split(";");
      const quality = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith("q="));
      const parsed = quality ? Number.parseFloat(quality.slice(2)) : 1;

      return {
        tag: tag.trim().toLowerCase(),
        quality: Number.isFinite(parsed) ? parsed : 0,
      };
    })
    .filter((entry) => entry.tag.length > 0 && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (tag === "*") {
      return DEFAULT_LOCALE;
    }

    const primary = tag.split("-")[0];

    if (isLocale(primary)) {
      return primary;
    }
  }

  return null;
}

function persistLocale(response: NextResponse, locale: Locale): NextResponse {
  response.cookies.set({
    name: LOCALE_COOKIE,
    value: locale,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
  });

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = pathname.split("/")[1];

  // La URL ya declara el locale: se respeta y se persiste la elección, así el
  // toggle no necesita escribir la cookie desde el cliente.
  if (isLocale(prefix)) {
    const response = NextResponse.next();

    return request.cookies.get(LOCALE_COOKIE)?.value === prefix
      ? response
      : persistLocale(response, prefix);
  }

  const stored = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(stored)
    ? stored
    : (localeFromAcceptLanguage(request.headers.get("accept-language")) ?? DEFAULT_LOCALE);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return persistLocale(NextResponse.redirect(url), locale);
}

export const config = {
  // Todo menos internos de Next y archivos con extensión.
  matcher: ["/((?!_next/|api/|.*\..*).*)"],
};
