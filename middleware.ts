import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
	"/sign-in",
	"/sign-up",
	"/",
	"/home",
  "/api/webhook/stripe" // Important to allow Stripe webhook
])

const isPublicApiRoute = createRouteMatcher([
	"/api/videos",
  "/api/webhook/stripe"
])

const isProRoute = createRouteMatcher([
  "/social-share(.*)",
  // We can also protect specific API routes here
])

export default clerkMiddleware(async (auth, req) => {
	const authObject = await auth();
  const userId = authObject.userId;
  const sessionClaims = authObject.sessionClaims;

	const currentUrl = new URL(req.url);
	const isHomePage = currentUrl.pathname === "/home";
	const isApiRequest = currentUrl.pathname.startsWith("/api");
	
	if(userId && isPublicRoute(req) && !isHomePage){
		return NextResponse.redirect(new URL("/home", req.url))
	}
	
	if(!userId){
		if(!isPublicRoute(req) && !isPublicApiRoute(req)){
			return NextResponse.redirect(new URL("/sign-up", req.url))
		}
		if(isApiRequest && !isPublicApiRoute(req)){
			return NextResponse.redirect(new URL("/sign-in", req.url))
		}
	}

  // PRO access control
  if (userId && isProRoute(req)) {
    const tier = sessionClaims?.publicMetadata?.tier as string | undefined;
    if (tier !== "PRO") {
      // Redirect to a pricing or upgrade page
      return NextResponse.redirect(new URL("/home?upgrade=true", req.url))
    }
  }

	return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}