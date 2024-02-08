'use server';
import 'server-only';
import { cookies } from 'next/headers';
import { writeAccessFirmhouseClient } from '../firmhouse-write';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  OrderedProductIntervalUnitOfMeasure,
  ServerError,
  ValidationError,
} from '@firmhouse/firmhouse-sdk';
import { getActiveProjectType } from './projects';
import { createAuthToken, verifyAndDecodeAuthToken } from '../auth';
import dayjs from 'dayjs';

const SSC_SUBSCRIPTION_TOKEN_COOKIE = 'firmhouse:ssc';

async function getSSCSubscriptionTokenCookieKey() {
  return `${SSC_SUBSCRIPTION_TOKEN_COOKIE}:${await getActiveProjectType()}`;
}

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
    cookies().set(
      await getSSCSubscriptionTokenCookieKey(),
      await createAuthToken(subscription.token)
    );
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

export async function hasValidSSCAuthToken() {
  const jwtToken =
    cookies().get(await getSSCSubscriptionTokenCookieKey())?.value ?? '';
  if (!jwtToken) {
    return false;
  }
  try {
    return !!(await verifyAndDecodeAuthToken(jwtToken));
  } catch (e) {
    return false;
  }
}

export async function getSSCSubscriptionToken(): Promise<string> {
  try {
    const jwtToken =
      cookies().get(await getSSCSubscriptionTokenCookieKey())?.value ?? '';
    return verifyAndDecodeAuthToken(jwtToken);
  } catch (e) {
    clearSSCSubscriptionToken();
    throw new Error('SSC token is missing');
  }
}

export async function clearSSCSubscriptionToken(): Promise<void> {
  cookies().delete(await getSSCSubscriptionTokenCookieKey());
}

export async function cancelSubscription(): Promise<void> {
  const client = await writeAccessFirmhouseClient();
  await client.subscriptions.cancel({ token: await getSSCSubscriptionToken() });
  revalidatePath('/');
  redirect('/');
}

export async function removeOrderedProduct(
  orderedProductId: string
): Promise<void> {
  const client = await writeAccessFirmhouseClient();
  await client.subscriptions.removeFromCart(
    orderedProductId,
    await getSSCSubscriptionToken()
  );
  revalidatePath('/');
  revalidatePath(`/orderedProducts/${orderedProductId}`);
  redirect('/');
}

export async function updateOrderedProductInterval(
  token: string,
  orderedProductId: string,
  formData: FormData
): Promise<void> {
  const client = await writeAccessFirmhouseClient();
  const interval = formData.has('interval')
    ? parseInt(formData.get('interval') as string)
    : null;
  const unitOfMeasure = formData.get(
    'unitOfMeasure'
  ) as OrderedProductIntervalUnitOfMeasure;
  await client.subscriptions.updateOrderedProduct(
    {
      intervalUnitOfMeasureType: unitOfMeasure,
      interval: interval,
      id: orderedProductId,
    },
    token
  );
  revalidatePath('/');
  revalidatePath(`/orderedProducts/${orderedProductId}`);
}

export async function updateShipmentDate(
  token: string,
  orderedProductId: string,
  formData: FormData
): Promise<void> {
  const client = await writeAccessFirmhouseClient();
  const shipmentDate = formData.get('shipmentDate') as string;
  await client.subscriptions.updateOrderedProduct(
    {
      shipmentDate: dayjs(shipmentDate).format('YYYY-MM-DD'),
      id: orderedProductId,
    },
    token
  );
  revalidatePath('/');
  revalidatePath(`/orderedProducts/${orderedProductId}`);
}
