import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/auth",
  publicRoutes: ["/", "/about", "/services", "/markets", "/faq", "/contact", "/privacy", "/terms", "/risk", "/auth"],
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
