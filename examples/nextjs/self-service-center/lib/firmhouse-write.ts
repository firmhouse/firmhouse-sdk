'use server';
import 'server-only';
import { Access, FirmhouseClient } from '@firmhouse/firmhouse-sdk';
import { getAccessTokenForProject } from './actions/projects';

export const writeAccessFirmhouseClient = async () => {
  return new FirmhouseClient({
    apiToken: await getAccessTokenForProject(),
    accessType: Access.write,
  });
};
