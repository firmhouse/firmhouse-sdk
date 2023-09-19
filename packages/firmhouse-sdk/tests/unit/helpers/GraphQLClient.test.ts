import GraphQLClient from "@firmhouse/firmhouse-sdk/lib/helpers/GraphQLClient"
import {   GraphQLClient as GraphQLClientBase } from 'graphql-request';
jest.mock('graphql-request')

const mockedBaseClient = jest.mocked(GraphQLClientBase)

describe('helpers/GraphQLClient', () => {
    beforeEach(() => {
        mockedBaseClient.mockClear()
    })
    it('should initialize the GraphQLClient correctly', () => {
        const token = 'test'
        const url = 'https://portal.firmhouse.com/graphql'
        new GraphQLClient(token)
        expect(GraphQLClientBase).toHaveBeenCalledWith(url, {
            headers: {
                'X-Project-Access-Token': token,
            },
            responseMiddleware: expect.any(Function)
        })
    })

    // it('should run the responseMiddleware when a response is received', async () => {
    //     const token = 'test'
    //     new GraphQLClient(token)
    //     const responseMiddleware = mockedBaseClient.mock.calls?.[0]?.[1]?.responseMiddleware
    //     const clientError = new ClientError({ errors: [], status: 200 }, { query: '' })
    //     clientError.response = { errors: [], status: 200 }
    //     expect(responseMiddleware).toBeDefined()
    //     expect(() => responseMiddleware && responseMiddleware(clientError)).toThrowError()
    // })
})