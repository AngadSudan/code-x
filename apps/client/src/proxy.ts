import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "path-to-regexp";

import { URL_ACCESS_MAP } from "@/lib/access";
import { checkJWT } from "@/lib/authJWT";

/**
 * Matches a pathname against role-based route patterns
 */
function isRouteAllowed(pathname: string, routes: string[]) {
  return routes.some((route) => {
    const matcher = match(route, {
      decode: decodeURIComponent,
      end: true, // exact match, no extra segments
    });
    return matcher(pathname);
  });
}

export function proxy(request: NextRequest) {
  //   const { pathname } = request.nextUrl;
  //   /**
  //    * Public routes
  //    */
  //   const PUBLIC_ROUTES = [
  //     "/",
  //     "/about",
  //     "/contact",
  //     "/login",
  //     "/register",
  //     "/interviewer/login",
  //     "/interviewer/register",
  //     "/org/login",
  //     "/org/register",
  //   ];
  //   if (PUBLIC_ROUTES.includes(pathname)) {
  //     return NextResponse.next();
  //   }
  //   /**
  //    * Auth check
  //    */
  //   const token = request.cookies.get("token")?.value;
  //   const jwtData = token ? checkJWT(token) : null;
  //   const role = jwtData?.type;
  //   if (!role) {
  //     return NextResponse.redirect(new URL("/student-login", request.url));
  //   }
  //   if (role && request.url.includes("login")) {
  //     switch (role) {
  //       case "USER":
  //         return NextResponse.redirect(new URL("/profile", request.url));
  //       case "INTERVIEWER":
  //         return NextResponse.redirect(
  //           new URL("/interview-profile", request.url),
  //         );
  //       default:
  //         return NextResponse.redirect(new URL("/", request.url));
  //     }
  //   }
  //   /**
  //    * Resolve allowed routes
  //    */
  //   let allowedRoutes = URL_ACCESS_MAP[role];
  //   // SUPERADMIN inherits ADMIN permissions
  //   if (role === "USER") {
  //     allowedRoutes = URL_ACCESS_MAP["USER"];
  //   }
  //   if (!allowedRoutes) {
  //     return NextResponse.redirect(new URL("/profile", request.url));
  //   }
  //   /**
  //    * Authorization check
  //    */
  //   if (isRouteAllowed(pathname, allowedRoutes)) {
  //     return NextResponse.next();
  //   }
  //   /**
  //    * Fallback redirects per role
  //    */
  //   switch (role) {
  //     case "ADMIN":
  //     case "SUPERADMIN":
  //       return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  //     case "TEACHER":
  //       return NextResponse.redirect(new URL("/teacher-dashboard", request.url));
  //     case "STUDENT":
  //       return NextResponse.redirect(new URL("/dashboard", request.url));
  //     case "INSTITUTION":
  //       return NextResponse.redirect(
  //         new URL("/institution-dashboard", request.url),
  //       );
  //     case "VENDOR":
  //       return NextResponse.redirect(new URL("/vendor-dashboard", request.url));
  //     default:
  //       return NextResponse.redirect(new URL("/", request.url));
  //   }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
