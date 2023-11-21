import { BaseResource } from '@firmhouse/firmhouse-sdk/lib/resources/BaseResource';
import { FirmhouseClient } from '@firmhouse/firmhouse-sdk/lib/FirmhouseClient';

describe('lib/FirmhouseClient.ts', () => {
  describe('FirmhouseClient', () => {
    it('should initialize the FirmhouseClient correctly', () => {
      const config = {
        apiToken: 'test',
        baseUrl: 'https://portal.firmhouse.com/graphql',
      };
      const client = new FirmhouseClient({
        apiToken: config.apiToken,
        baseUrl: config.baseUrl,
      });
      expect(client.products).toBeDefined();
      expect(client.plans).toBeDefined();
      expect(client.selfServiceCenterToken).toBeDefined();
      expect(client.subscriptions).toBeDefined();
    });
  });
});
