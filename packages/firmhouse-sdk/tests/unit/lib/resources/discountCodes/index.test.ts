import {
  ServerError,
  NotFoundError,
} from '@firmhouse/firmhouse-sdk/lib/helpers/errors';

import { _GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { DiscountCodesResource } from '../../../../../src/lib/resources/discountCodes/index';
import {} from '../../../../../src/lib/helpers/errors';

jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');

describe('lib/resources/discountCodes/index.ts', () => {
  let mockGraphQLClient: _GraphQLClient;

  beforeEach(() => {
    mockGraphQLClient = new _GraphQLClient('test', 'http://test.com');
  });

  it('should initialize the DiscountCodesResource correctly', () => {
    const testResource = new DiscountCodesResource(mockGraphQLClient);
    expect(testResource).toBeInstanceOf(DiscountCodesResource);
  });

  describe('get', () => {
    it('should return a discount code when given a valid id', async () => {
      const testResource = new DiscountCodesResource(mockGraphQLClient);
      mockGraphQLClient.request = jest.fn().mockResolvedValue({
        getDiscountCode: {
          id: 'test-id',
          code: 'TESTCODE',
          discountType: 'percentage',
          discountPercentage: 10,
        },
      });

      const result = await testResource.get('test-id');
      expect(result).toEqual({
        id: 'test-id',
        code: 'TESTCODE',
        discountType: 'percentage',
        discountPercentage: 10,
      });
    });

    it('should throw a ServerError when the request fails', async () => {
      const testResource = new DiscountCodesResource(mockGraphQLClient);
      mockGraphQLClient.request = jest
        .fn()
        .mockRejectedValue(new ServerError('Test error'));

      await expect(testResource.get('test-id')).rejects.toThrow(ServerError);
    });

    it('should throw a NotFound error when the response does not contain a discount code', async () => {
      const testResource = new DiscountCodesResource(mockGraphQLClient);
      mockGraphQLClient.request = jest.fn().mockResolvedValue({});

      await expect(testResource.get('test-id')).rejects.toThrow(NotFoundError);
    });
  });
});
