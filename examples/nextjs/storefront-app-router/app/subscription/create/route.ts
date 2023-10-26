import { redirect } from 'next/navigation';
import { initializeCart } from '../../../lib/actions/subscription';

export async function GET(request: Request) {
  // Initialize subscription cart
  await initializeCart();
  redirect('/');
}
