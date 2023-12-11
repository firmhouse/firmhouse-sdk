import { type NextRequest } from 'next/server';
import { createSSCSubscriptionCookie } from '../../../../lib/actions/subscription';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  if (!token) {
    redirect('/self-service-center/login');
  }
  return createSSCSubscriptionCookie(token, '/self-service-center');
}
