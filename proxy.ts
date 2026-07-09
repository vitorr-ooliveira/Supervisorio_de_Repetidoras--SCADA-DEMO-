import { NextRequest, NextResponse } from 'next/server';
import { getSession, SessionData } from './lib/auth';

/**
 * Next.js 16 Proxy Function (Official Replacement for middleware.ts).
 * This function is automatically run by Next.js for every request.
 */
export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('auth_session');

  // Bypass API routes, static files, and _next files
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = !!sessionCookie;

  // Route guarding redirect logic
  if (!isAuthenticated && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check role restrictions for UI routes
  if (isAuthenticated && sessionCookie?.value) {
    try {
      // Decode user role from base64 session cookie value
      const rawSession = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
      const session = JSON.parse(rawSession) as SessionData;

      // Technicians cannot access /repetidoras or /usuarios
      if (session.role === 'tecnico' && (path === '/repetidoras' || path === '/usuarios')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Gestores cannot access /usuarios
      if (session.role === 'gestor' && path === '/usuarios') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      // If cookie parsing fails, clear session and redirect to login
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.delete('auth_session');
      return res;
    }
  }

  return NextResponse.next();
}

/**
 * Validates if the current request is authenticated and has the correct permissions.
 * Used inside Next.js API Routes.
 */
export async function validateAuth(): Promise<{
  isAuthenticated: boolean;
  user: SessionData | null;
}> {
  const session = await getSession();
  if (!session) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }

  return {
    isAuthenticated: true,
    user: session,
  };
}

/**
 * Check if the authenticated user has any of the required roles.
 * Used inside Next.js API Routes.
 */
export async function validateRole(allowedRoles: ('admin' | 'gestor' | 'tecnico')[]): Promise<boolean> {
  const auth = await validateAuth();
  if (!auth.isAuthenticated || !auth.user) {
    return false;
  }
  return allowedRoles.includes(auth.user.role);
}
