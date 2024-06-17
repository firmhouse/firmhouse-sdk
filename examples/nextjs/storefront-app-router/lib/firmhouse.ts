import { FirmhouseClient } from '@firmhouse/firmhouse-sdk';

export const firmhouseClient = new FirmhouseClient({
  apiToken:
    process.env.NEXT_PUBLIC_PLAN_BASED_FIRMHOUSE_STOREFRONT_ACCESS_TOKEN ?? '',
});
