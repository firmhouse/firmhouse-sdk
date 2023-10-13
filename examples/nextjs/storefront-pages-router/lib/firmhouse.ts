import { FirmhouseClient } from '@firmhouse/firmhouse-sdk';

export const firmhouseClient = new FirmhouseClient({
  apiToken: process.env.NEXT_PUBLIC_ORDER_BASED_PROJECT_ACCESS_TOKEN ?? '',
});
