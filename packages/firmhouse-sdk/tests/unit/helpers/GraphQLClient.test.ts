import {
  NotFoundError,
  ServerError,
  ValidationError,
} from '@firmhouse/firmhouse-sdk';
import { _GraphQLClient as GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
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
      const errors = [
        {
          message: 'should be a string',
          attribute: 'productId',
          path: [],
        },
      ];
      e.response = {
        errors: [
          {
            extensions: {
              problems: errors,
            },
          } as unknown as GraphQLError,
        ],
        status: 0,
      };
      let error: ValidationError | null = null;
      try {
        client._responseMiddleware(e);
      } catch (e) {
        error = e as ValidationError;
      }

      expect(error).toEqual(new ValidationError(errors));
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
      let error: NotFoundError | null = null;
      try {
        client._responseMiddleware(e);
      } catch (e) {
        error = e as NotFoundError;
      }

      expect(error).toEqual(new NotFoundError('Product not found'));
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
      let error: ServerError | null = null;
      try {
        client._responseMiddleware(e);
      } catch (e) {
        error = e as ServerError;
      }

      expect(error).toEqual(new ServerError('Unknown error'));
    });
  });
});
