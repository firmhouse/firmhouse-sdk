import { AllPlansDocument } from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import GraphQLClient from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { PlansResource } from '@firmhouse/firmhouse-sdk/lib/resources/plans';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');
describe('lib/resources/plans/index.ts', () => {
  it('should initialize the PlansResource correctly', () => {
    const graphQLClient = new GraphQLClient('test', 'http://test.com');
    const testResource = new PlansResource(graphQLClient);
    expect(testResource).toBeInstanceOf(PlansResource);
  });

  describe('fetchAll', () => {
    it('should call the correct query', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ plans: { nodes: [] } });
      const testResource = new PlansResource(graphQLClient);
      await testResource.fetchAll();
      expect(graphQLClient.request).toHaveBeenCalledWith(
        AllPlansDocument,
        {}
      );
    });

    it('should parse parameters correctly', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ plans: { nodes: [] } });
      const testResource = new PlansResource(graphQLClient);
      const params = {
        after: 'test',
        before: 'test',
        first: 10,
        last: 10,
      };
      await testResource.fetchAll(params);
      expect(graphQLClient.request).toHaveBeenCalledWith(
        AllPlansDocument,
        params
      );
    });

    it('should filter the null values', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ plans: { nodes: [{ id: 'test' }, null], totalCount: 1, pageInfo: {hasNextPage: false, hasPreviousPage:false } } });
      const testResource = new PlansResource(graphQLClient);
      const res = await testResource.fetchAll();
      expect(res.results).toHaveLength(1);
      expect(res.results).not.toContain(null);
      expect(res.total).toBe(1);
      expect(res.pageInfo).toStrictEqual({hasNextPage: false, hasPreviousPage:false });
    });

    it('should return empty array if API returns null', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({ plans: null });
      const testResource = new PlansResource(graphQLClient);
      const res = await testResource.fetchAll();
      expect(res.results).toStrictEqual([]);
    });
  });

});
