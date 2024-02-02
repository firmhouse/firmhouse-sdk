import { GraphQLClient } from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { NotFoundError } from '@firmhouse/firmhouse-sdk/lib/helpers/errors';
import { ProjectsResource } from '@firmhouse/firmhouse-sdk/lib/resources/projects';
import { GetCurrentProjectDocument } from '@firmhouse/firmhouse-sdk/lib/resources/projects/projects.generated';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');
describe('lib/resources/projects/index.ts', () => {
  it('should initialize the ProductsResource correctly', () => {
    const graphQLClient = new GraphQLClient('test', 'http://test.com');
    const testResource = new ProjectsResource(graphQLClient);
    expect(testResource).toBeInstanceOf(ProjectsResource);
  });

  describe('getCurrent', () => {
    it('should call the correct query', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getCurrentProject: { id: 'x' } });
      const testResource = new ProjectsResource(graphQLClient);
      expect(await testResource.getCurrent()).toEqual({ id: 'x' });
      expect(graphQLClient.request).toHaveBeenCalledWith(
        GetCurrentProjectDocument,
        {
          includeExtraFields: false,
          includePromotions: false,
          includeTaxRates: false,
        }
      );
    });

    it('should parse parameters correctly', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getCurrentProject: { id: 'x' } });
      const testResource = new ProjectsResource(graphQLClient);
      const params = {
        includeExtraFields: true,
        includePromotions: true,
        includeTaxRates: true,
      };
      await testResource.getCurrent({
        extraFields: true,
        promotions: true,
        taxRates: true,
      });
      expect(graphQLClient.request).toHaveBeenCalledWith(
        GetCurrentProjectDocument,
        params
      );
    });

    it('should throw not found arrow if the response is null', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ getCurrentProject: null });
      const testResource = new ProjectsResource(graphQLClient);
      expect(testResource.getCurrent()).rejects.toThrow(NotFoundError);
    });
  });
});
