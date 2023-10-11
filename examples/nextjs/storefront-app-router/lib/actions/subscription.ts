'use server';
import 'server-only';
import { cookies } from 'next/headers';
import { firmhouseClient } from '../firmhouse';
import { revalidatePath } from 'next/cache';
import { getISO8601Date } from '@firmhouse/ui-components';
import { redirect } from 'next/navigation';
import { ServerError, ValidationError } from '@firmhouse/firmhouse-sdk';

const SUBSCRIPTION_TOKEN_COOKIE = 'firmhouse:subscription';

export async function isInitialized(): Promise<boolean> {
  return cookies().get(SUBSCRIPTION_TOKEN_COOKIE) !== undefined;
}

export async function getSubscriptionToken(): Promise<string> {
  return cookies().get(SUBSCRIPTION_TOKEN_COOKIE)?.value ?? '';
}

export async function clearSubscriptionToken(): Promise<void> {
  cookies().delete(SUBSCRIPTION_TOKEN_COOKIE);
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
  const subscriptionToken = await getSubscriptionToken();
  await firmhouseClient.subscriptions.addToCart(
    { productId, quantity },
    subscriptionToken
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

export async function updateCheckoutDetails(data: FormData) {
  const body = Object.fromEntries(
    Object.entries({
      name: data.get('name') as string,
      lastName: data.get('lastName') as string,
      email: data.get('email') as string,
      phoneNumber: data.get('phoneNumber') as string,
      dateOfBirth: getISO8601Date(data.get('dateOfBirth') as string),
      address: data.get('address') as string,
      zipcode: data.get('zipcode') as string,
      city: data.get('city') as string,
      country: data.get('country') as string,
      termsAccepted: data.get('termsAccepted ') === 'on'
    }).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
  let success = false;
  let paymentUrl;
  try {
    await firmhouseClient.subscriptions.updateAddressDetails(
      body,
      await getSubscriptionToken()
    );
    const paymentResponse =
      await firmhouseClient.subscriptions.finaliseSubscription(
        '',
        '',
        await getSubscriptionToken()
      );
    paymentUrl = paymentResponse.paymentUrl;
    if (paymentUrl === null || paymentUrl === undefined) {
      throw new ServerError(
        'Cannot proceed with the payment now. Please try again later.'
      );
    }
    success = true;
    // We do not redirect here because nextjs handles redirects by throwing special error
    // So if we call redirect here it will be caught by the catch block
  } catch (error) {
    if (error instanceof ValidationError) {
      return error.details;
    }
    if (error instanceof ServerError) {
      return { error: error.message };
    }
    return { error: 'Cannot proceed with the payment now. Please try again later.' };
  }
  
  if (success) {
    redirect(paymentUrl);
  }
}
