import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/api/webhook/clerk"]);
const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request) && !isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
