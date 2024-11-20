import { authMiddleware } from "@clerk/nextjs";

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
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 