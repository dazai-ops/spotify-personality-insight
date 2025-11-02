// app/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middeleware(req) {
    const {pathname} = req.nextUrl
    const token = req.nextauth.token

    if(pathname === "/") {
      const onboardingUrl = new URL("/onboarding", req.url)
      return NextResponse.redirect(onboardingUrl)
    }
    if(!token && pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url)
      return NextResponse.redirect(onboardingUrl)
    }
    if(token && (pathname === "/onboarding" || pathname === "/")) {
      const homeUrl = new URL("/home", req.url)
      return NextResponse.redirect(homeUrl)
    }
  },
  {
    callbacks: {
      authorized: () => true,
    }
  }
  
)

export const config = {
  matcher: ["/","/onboarding", "/home", "/personality-insight"], // halaman yang butuh login
}
