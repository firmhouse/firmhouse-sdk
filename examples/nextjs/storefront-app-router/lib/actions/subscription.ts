'use server';
import { cookies } from 'next/headers';
import { firmhouseClient } from '../firmhouse';
import { revalidatePath } from 'next/cache';

const SUBSCRIPTION_TOKEN_COOKIE = 'firmhouse:subscription';

export async function isInitialized(): Promise<boolean> {
  return cookies().get(SUBSCRIPTION_TOKEN_COOKIE) !== undefined;
}

export async function getSubscriptionToken(): Promise<string> {
  return cookies().get(SUBSCRIPTION_TOKEN_COOKIE)?.value ?? '';
}

export async function initializeCart() {
  const subscriptionToken =
    cookies().get(SUBSCRIPTION_TOKEN_COOKIE)?.value ?? undefined;
  const response =
    await firmhouseClient.subscriptions.getOrCreateDraftSubscription(
      subscriptionToken
    );
  cookies().set(SUBSCRIPTION_TOKEN_COOKIE, response.token);
}

export async function addToCart(data: FormData) {
  if (!(await isInitialized())) {
    await initializeCart();
  }
  const productId = data.get('productId') as string;
  const quantity = parseInt(data.get('quantity') as string);
  await firmhouseClient.subscriptions.addToCart(
    { productId, quantity },
    await getSubscriptionToken()
  );
  revalidatePath('/');
}

export async function removeFromCart(data: FormData) {
  const id = data.get('orderedProductId') as string;
  await firmhouseClient.subscriptions.removeFromCart(
    id,
    await getSubscriptionToken()
  );
  revalidatePath('/');
}

export async function updateQuantity(data: FormData) {
  const id = data.get('orderedProductId') as string;
  const quantity = parseInt(data.get('quantity') as string);

  await firmhouseClient.subscriptions.updateOrderedProductQuantity(
    id,
    quantity,
    await getSubscriptionToken()
  );
  revalidatePath('/');
}
