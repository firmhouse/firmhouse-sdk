import GraphQLClient from "@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient"
import { GraphQLClient as GraphQLClientBase } from 'graphql-request';
jest.mock('graphql-request')

describe('helpers/GraphQLClient', () => {
    it('should initialize the GraphQLClient correctly', () => {
        const token = 'test'
        const url = 'https://portal.firmhouse.com/graphql'
        const client = new GraphQLClient(token)
        expect(GraphQLClientBase).toHaveBeenCalledWith(url, {
            headers: {
                'X-Project-Access-Token': token,
            }
        })        
    })
})