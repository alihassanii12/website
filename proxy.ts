// website/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Agar token hai → user logged in → dashboard redirect
  if (token) {
    return NextResponse.redirect("http://localhost:3001");
  }

  // Token nahi hai → normal website access
  return NextResponse.next();
}

// Apply to all website routes
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // all pages except _next
};