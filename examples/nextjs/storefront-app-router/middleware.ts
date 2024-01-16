import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSSCSubscriptionToken } from './lib/actions/subscription';

export async function middleware(request: NextRequest) {
  const sscResponse = selfServiceCenterMiddleware(request);
  if (sscResponse) {
    return sscResponse;
  }
  return NextResponse.next();
}

async function selfServiceCenterMiddleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/self-service-center') &&
    ['login', 'status', 'token-login'].every(
      (path) => `/self-service-center/${path}` !== request.nextUrl.pathname
    )
  ) {
    const token = await getSSCSubscriptionToken();
    if (token === '') {
      return redirect(request, '/self-service-center/login');
    }
  }
}

function redirect(request: NextRequest, path: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/self-service-center/:path*'],
};
