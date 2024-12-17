import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


const isPublicRoute=createRouteMatcher([
	"/sign-in",
	"/sign-up",
	"/",
	"/home"
])

const isPublicApiRoute=createRouteMatcher([
	"/api/videos",
	
])


export default clerkMiddleware(async(auth,req)=>{

	const { userId } = await auth();
	console.log("user details",userId)

	const currentUrl=new URL(req.url) ;
	const isHomePage=currentUrl.pathname==="/home"
	const isApiRequest=currentUrl.pathname.startsWith("/api")
	
	if(userId && isPublicRoute(req) && !isHomePage){
		console.log(userId)
		return NextResponse.redirect(new URL("/home",req.url))
	}

	
	if(!userId){
		console.log("clerk details",userId)
		if(!isPublicRoute(req) && !isPublicApiRoute(req) ){
			return NextResponse.redirect(new URL("/sign-up",req.url))
		}
		if(isApiRequest && !isPublicApiRoute(req)){
			return NextResponse.redirect(new URL("/sign-in",req.url))

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