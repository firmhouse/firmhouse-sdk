import { AllProductsDocument } from '@firmhouse/firmhouse-sdk/lib/graphql/generated';
import GraphQLClient from '@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient';
import { ProductsResource } from '@firmhouse/firmhouse-sdk/lib/resources/products';
jest.mock('@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient');
describe('lib/resources/products/index.ts', () => {
  it('should initialize the ProductsResource correctly', () => {
    const graphQLClient = new GraphQLClient('test', 'http://test.com');
    const testResource = new ProductsResource(graphQLClient);
    expect(testResource).toBeInstanceOf(ProductsResource);
  });

  describe('fetchAll', () => {
    it('should call the correct query', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ products: { nodes: [] } });
      const testResource = new ProductsResource(graphQLClient);
      await testResource.fetchAll();
      expect(graphQLClient.request).toHaveBeenCalledWith(
        AllProductsDocument,
        {}
      );
    });

    it('should parse parameters correctly', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ products: { nodes: [] } });
      const testResource = new ProductsResource(graphQLClient);
      const params = {
        after: 'test',
        before: 'test',
        first: 10,
        last: 10,
        id: 'test',
        shopifyVariantId: 'test',
        sku: 'test',
        updatedSince: '2020-01-01',
      };
      await testResource.fetchAll(params);
      expect(graphQLClient.request).toHaveBeenCalledWith(
        AllProductsDocument,
        params
      );
    });

    it('should filter the null values', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ products: { nodes: [{ id: 'test' }, null] } });
      const testResource = new ProductsResource(graphQLClient);
      const res = await testResource.fetchAll();
      expect(res.results).toHaveLength(1);
      expect(res.results).not.toContain(null);
    });

    it('should return empty array if API returns null', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest.fn().mockResolvedValue({ products: null });
      const testResource = new ProductsResource(graphQLClient);
      const res = await testResource.fetchAll();
      expect(res.results).toStrictEqual([]);
    });
  });

  describe('fetchById', () => {
    it('should call the correct query', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ products: { nodes: [{id: 'test'}] } });
      const testResource = new ProductsResource(graphQLClient);
      const id = 'testId';
      await testResource.fetchById(id);
      expect(graphQLClient.request).toHaveBeenCalledWith(AllProductsDocument, {
        id,
      });
    });

    it('should return the product matching given id', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      const product = { id: 'testId' };
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ products: { nodes: [product] } });
      const testResource = new ProductsResource(graphQLClient);
      const id = 'testId';
      expect(testResource.fetchById(id)).resolves.toStrictEqual(product);
    });

    it('should throw error if id is not matched', async () => {
      const graphQLClient = new GraphQLClient('test', 'http://test.com');
      graphQLClient.request = jest
        .fn()
        .mockResolvedValue({ products: { nodes: [] } });
      const testResource = new ProductsResource(graphQLClient);
      const id = 'testId';
      expect(
        testResource.fetchById(id)
      ).rejects.toThrow('Product not found');
    });
  });
});
