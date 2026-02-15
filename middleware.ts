import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if Clerk is configured
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkKey && !clerkKey.includes('placeholder');

  // If Clerk is not configured, only allow public routes
  if (!isClerkConfigured) {
    // Note: /studio is available in demo mode for content management
    const protectedPaths = ['/dashboard', '/library'];
    const isProtected = protectedPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtected) {
      console.warn('⚠️  Clerk not configured - redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
