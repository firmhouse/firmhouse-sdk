import { ValidationError } from '@firmhouse/firmhouse-sdk';
import { GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import {
  ClientError,
  GraphQLClient as GraphQLClientBase,
  type ResponseMiddleware,
} from 'graphql-request';
jest.mock('graphql-request');
type GraphQLResponse = ConstructorParameters<typeof ClientError>[0];
type GraphQLRequestContext = ConstructorParameters<typeof ClientError>[1];
type GraphQLClientResponse = Exclude<Parameters<ResponseMiddleware>[0], Error>;
type GraphQLError = NonNullable<GraphQLClientResponse['errors']>[0];
const mockedBaseClient = jest.mocked(GraphQLClientBase);

describe('helpers/GraphQLClient', () => {
  beforeEach(() => {
    mockedBaseClient.mockClear();
  });
  it('should initialize the GraphQLClient correctly', () => {
    const token = 'test';
    const url = 'https://portal.firmhouse.com/graphql';
    const client = new GraphQLClient(token);
    expect(GraphQLClientBase).toHaveBeenCalledWith(url, {
      fetch: undefined,
      headers: {
        'X-Project-Access-Token': token,
      },
      responseMiddleware: client._responseMiddleware,
    });
  });

  it('should use the global fetch', () => {
    const token = 'test';
    const url = 'https://portal.firmhouse.com/graphql';
    const customFetch = async (input: RequestInfo | URL) =>
      null as unknown as Response;
    globalThis.fetch = customFetch;
    const client = new GraphQLClient(token);
    expect(GraphQLClientBase).toHaveBeenCalledWith(url, {
      fetch: customFetch,
      headers: {
        'X-Project-Access-Token': token,
      },
      responseMiddleware: client._responseMiddleware,
    });
  });
  describe('_responseMiddleware', () => {
    it('should map validation errors to correct HTTP error', async () => {
      const client = new GraphQLClient('token');
      const e = new ClientError(
        {} as GraphQLResponse,
        {} as GraphQLRequestContext
      );
      e.response = {
        errors: [
          {
            extensions: {
              problems: [
                {
                  message: 'should be a string',
                  attribute: 'productId',
                  path: [],
                },
              ],
            },
          } as unknown as GraphQLError,
        ],
        status: 0,
      };

      const response = await client._responseMiddleware(e);
      expect(response?.name).toBe('ValidationError');
      expect((response as ValidationError).details).toEqual({
        productId: 'should be a string',
      });
    });

    it('should map not found errors to correct HTTP error', async () => {
      const client = new GraphQLClient('token');
      const e = new ClientError(
        {} as GraphQLResponse,
        {} as GraphQLRequestContext
      );
      e.response = {
        errors: [
          {
            message: 'Product not found',
            extensions: {
              code: 'RECORD_NOT_FOUND',
            },
          } as unknown as GraphQLError,
        ],
        status: 0,
      };

      const response = await client._responseMiddleware(e);
      expect(response?.name).toBe('NotFoundError');
      expect(response?.message).toBe('Product not found');
    });

    it('should map unknown errors as ServerError', async () => {
      const client = new GraphQLClient('token');
      const e = new ClientError(
        {} as GraphQLResponse,
        {} as GraphQLRequestContext
      );
      e.response = {
        errors: [
          {
            message: 'Unknown error',
          } as unknown as GraphQLError,
        ],
        status: 0,
      };

      const response = await client._responseMiddleware(e);
      expect(response?.name).toBe('ServerError');
      expect(response?.message).toBe('Unknown error');
    });
  });
});
