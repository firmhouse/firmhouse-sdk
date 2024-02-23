import {
  InvoiceStatusEnum,
  PaymentTypeEnum,
} from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import { _GraphQLClient as GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { InvoicesResource } from '@firmhouse/firmhouse-sdk/lib/resources/invoices';
import { AllInvoicesDocument } from '@firmhouse/firmhouse-sdk/lib/resources/invoices/allInvoices.generated';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');
describe('lib/resources/invoices/index.ts', () => {
  it('should initialize the InvoicesResource correctly', () => {
    const graphQLClient = new GraphQLClient('test', 'http://test.com');
    const testResource = new InvoicesResource(graphQLClient);
    expect(testResource).toBeInstanceOf(InvoicesResource);
  });

  describe('fetchAll', () => {
    it('should call the correct query', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({
        invoices: {
          totalCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'x',
            endCursor: 'y',
          },
          nodes: [{ id: 'x' }],
        },
      });

      const testResource = new InvoicesResource(graphQLClient);
      expect(await testResource.fetchAll()).toEqual({
        total: 1,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'x',
          endCursor: 'y',
        },
        results: [{ id: 'x' }],
      });
      expect(graphQLClient.request).toHaveBeenCalledWith(AllInvoicesDocument, {
        includeCollectionCases: false,
        includeInvoiceReminders: false,
        includeInvoiceLineItems: false,
        includePayment: false,
        includeOriginalInvoice: false,
      });
    });

    it('should parse parameters correctly', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getCurrentProject: { id: 'x' } });
      const testResource = new InvoicesResource(graphQLClient);
      const params = {
        includeCollectionCases: true,
        includeInvoiceReminders: true,
        includeInvoiceLineItems: true,
        includePayment: true,
        includeOriginalInvoice: true,
        after: 'x',
        before: 'y',
        first: 10,
        last: 10,
        invoicedSince: '2021-01-01',
        invoicedUntil: '2021-02-01',
        paymentTypes: [
          PaymentTypeEnum.Authorization,
          PaymentTypeEnum.DirectPayment,
        ],
        statuses: [InvoiceStatusEnum.Open, InvoiceStatusEnum.Paid],
        subscriptionId: 'S1',
        updatedSince: '2021-01-01',
        updatedUntil: '2021-02-01',
      };
      await testResource.fetchAll(
        {
          after: 'x',
          before: 'y',
          first: 10,
          last: 10,
          invoicedSince: '2021-01-01',
          invoicedUntil: '2021-02-01',
          paymentTypes: [
            PaymentTypeEnum.Authorization,
            PaymentTypeEnum.DirectPayment,
          ],
          statuses: [InvoiceStatusEnum.Open, InvoiceStatusEnum.Paid],
          subscriptionId: 'S1',
          updatedSince: '2021-01-01',
          updatedUntil: '2021-02-01',
        },
        {
          collectionCases: true,
          invoiceReminders: true,
          invoiceLineItems: true,
          payment: true,
          originalInvoice: true,
        }
      );
      expect(graphQLClient.request).toHaveBeenCalledWith(
        AllInvoicesDocument,
        params
      );
    });
  });
});
