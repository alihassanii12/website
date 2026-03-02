import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {

  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  console.log(`🔍 Website Middleware - Path: ${pathname}`);
  console.log(`🔍 Token present: ${!!token}`);
  
  // Public routes that don't need redirect
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
  
  // Agar token hai aur user login page pe hai → dashboard redirect
  if (token && publicRoutes.includes(pathname)) {
    console.log(`🔄 User already logged in, redirecting to dashboard`);
    return NextResponse.redirect("https://dashboard-eta-gules-99.vercel.app");
  }

  // Token nahi hai → normal website access
  return NextResponse.next();
}

// Apply to all website routes
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};