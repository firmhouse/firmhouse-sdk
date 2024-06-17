'use server';
import 'server-only';
import { Access, FirmhouseClient } from '@firmhouse/firmhouse-sdk';

export const writeAccessFirmhouseClient = async () => {
  return new FirmhouseClient({
    apiToken: process.env.NEXT_PLAN_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN ?? '',
    accessType: Access.write,
  });
};
