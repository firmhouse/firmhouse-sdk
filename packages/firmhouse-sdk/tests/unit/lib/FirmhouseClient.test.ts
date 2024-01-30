import {
  Access,
  FirmhouseClient,
} from '@firmhouse/firmhouse-sdk/lib/FirmhouseClient';

describe('lib/FirmhouseClient.ts', () => {
  describe('FirmhouseClient', () => {
    describe('with storefront access type', () => {
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

    describe('with write access type', () => {
      it('should initialize the FirmhouseClient correctly', () => {
        const config = {
          apiToken: 'test',
          baseUrl: 'https://portal.firmhouse.com/graphql',
        };
        const client = new FirmhouseClient({
          apiToken: config.apiToken,
          baseUrl: config.baseUrl,
          accessType: Access.write,
        });
        expect(client.products).toBeDefined();
        expect(client.plans).toBeDefined();
        expect(client.selfServiceCenterToken).toBeDefined();
        expect(client.subscriptions).toBeDefined();
        expect(client.subscriptions.getWith).toBeDefined();
      });
    });
  });
});
