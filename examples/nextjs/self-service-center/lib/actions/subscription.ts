'use server';
import 'server-only';
import { cookies } from 'next/headers';
import { writeAccessFirmhouseClient } from '../firmhouse-write';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ServerError, ValidationError } from '@firmhouse/firmhouse-sdk';

const SSC_SUBSCRIPTION_TOKEN_COOKIE = 'firmhouse:ssc';

export async function createSSCSubscriptionCookie(
  selfServiceCenterLoginToken: string,
  redirectURL: string
): Promise<void> {
  try {
    const client = await writeAccessFirmhouseClient();
    const subscription =
      await client.subscriptions.getBySelfServiceCenterLoginToken(
        selfServiceCenterLoginToken
      );
    cookies().set(SSC_SUBSCRIPTION_TOKEN_COOKIE, subscription.token);
  } catch (e) {
    console.error(e);
    return redirect('/login');
  }
  redirect(redirectURL);
}

export async function updateSubscription(path: string, data: FormData) {
  const body: Record<string, string> = {};
  data.forEach((value, key) => {
    body[key] = value.toString();
  });
  const client = await writeAccessFirmhouseClient();
  try {
    client.subscriptions.updateAddressDetails(
      body,
      await getSSCSubscriptionToken()
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return error.details;
    }
    if (error instanceof ServerError) {
      return { error: error.message };
    }
  }
  if (path) {
    revalidatePath(path);
  }
}

export async function getSSCSubscriptionToken(): Promise<string> {
  return cookies().get(SSC_SUBSCRIPTION_TOKEN_COOKIE)?.value ?? '';
}

export async function clearSSCSubscriptionToken(): Promise<void> {
  cookies().delete(SSC_SUBSCRIPTION_TOKEN_COOKIE);
}

export async function cancelSubscription(): Promise<void> {
  const client = await writeAccessFirmhouseClient();
  await client.subscriptions.cancel({ token: await getSSCSubscriptionToken() });
  revalidatePath('/');
  redirect('/');
}
