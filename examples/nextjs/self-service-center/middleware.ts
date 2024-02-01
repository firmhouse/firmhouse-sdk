import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasValidSSCAuthToken } from './lib/actions/subscription';

export async function middleware(request: NextRequest) {
  const sscResponse = selfServiceCenterMiddleware(request);
  if (sscResponse) {
    return sscResponse;
  }
  return NextResponse.next();
}

async function selfServiceCenterMiddleware(request: NextRequest) {
  const hasValidToken = await hasValidSSCAuthToken();
  if (
    ['login', 'status', 'token-login'].every(
      (path) => `/${path}` !== request.nextUrl.pathname
    )
  ) {
    if (!hasValidToken) {
      return redirect(request, '/login');
    }
  } else {
    if (hasValidToken) {
      return redirect(request, '/');
    }
  }
}

function redirect(request: NextRequest, path: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|public/|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};
