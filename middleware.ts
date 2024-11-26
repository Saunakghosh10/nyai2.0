import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/pricing",
    "/about",
    "/contact",
  ],
  // Routes that can be accessed by authenticated and non-authenticated users
  ignoredRoutes: [
    "/_verify/images",
    "/api/og",
  ],
  // Custom handler for better error management
  afterAuth(auth, req) {
    // Handle authentication
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Add custom security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );

    return response;
  },
});

// Optimize matcher configuration for production
export const config = {
  matcher: [
    // Required for Clerk authentication
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};