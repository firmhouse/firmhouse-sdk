import { _GraphQLClient as GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { SelfServiceCenterTokenResource } from '@firmhouse/firmhouse-sdk/lib/resources/selfServiceCenterToken';
import { CreateSelfServiceCenterLoginTokenDocument } from '@firmhouse/firmhouse-sdk/lib/resources/selfServiceCenterToken/selfServiceCenterToken.generated';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');
describe('lib/resources/selfServiceCenterToken/index.ts', () => {
  it('should initialize the SelfServiceCenterToken correctly', () => {
    const graphQLClient = new GraphQLClient('test', 'http://test.com');
    const testResource = new SelfServiceCenterTokenResource(graphQLClient);
    expect(testResource).toBeInstanceOf(SelfServiceCenterTokenResource);
  });

  describe('create', () => {
    it('should call the correct query', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({
        createSelfServiceCenterLoginToken: { status: 'success', error: '' },
      });
      const testResource = new SelfServiceCenterTokenResource(graphQLClient);
      const email = 'test@example.com';
      const returnUrl = 'https://example.com';
      await testResource.create(email, returnUrl);
      expect(graphQLClient.request).toHaveBeenCalledWith(
        CreateSelfServiceCenterLoginTokenDocument,
        {
          email,
          returnUrl,
        }
      );
    });
  });
});
