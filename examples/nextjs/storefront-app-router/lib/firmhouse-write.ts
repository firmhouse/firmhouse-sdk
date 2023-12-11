'use server';
import 'server-only';
import { Access, FirmhouseClient } from '@firmhouse/firmhouse-sdk';

export const writeAccessFirmhouseClient = async () =>
  new FirmhouseClient({
    apiToken: process.env.NX_FIRMHOUSE_WRITE_ACCESS_TOKEN ?? '',
    accessType: Access.write,
  });
