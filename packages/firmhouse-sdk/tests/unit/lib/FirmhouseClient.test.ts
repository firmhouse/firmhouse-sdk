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
        expect(client.carts).toBeDefined();
        expect(() => client.invoices).toThrow(
          'Cannot access invoices resource with Storefront acess'
        );
        expect(() => client.projects).toThrow(
          'Cannot access projects resource with Storefront acess'
        );
        expect(() => client.subscriptions).toThrow(
          'Cannot access subscriptions resource with Storefront acess'
        );
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
        expect(client.carts).toBeDefined();
        expect(client.subscriptions).toBeDefined();
        expect(client.invoices).toBeDefined();
        expect(client.projects).toBeDefined();
        expect(client.projects.getCurrent).toBeDefined();
        expect(client.invoices.fetchAll).toBeDefined();
      });
    });
  });
});
