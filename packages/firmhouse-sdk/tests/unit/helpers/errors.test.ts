import { formatValidationErrors, snakeToCamelCase, NotFoundError, ServerError, ErrorType, ValidationError, mapToLibraryErrorTypes } from '@firmhouse/firmhouse-sdk/lib/helpers/errors'
import { ClientError } from 'graphql-request'
import { GraphQLError } from 'graphql-request/build/esm/types'

describe('helpers/errors', () => {
    describe('snakeToCamelCase', () => {
        it('should convert snake_case to camelCase', () => {
            expect(snakeToCamelCase('test_test')).toBe('testTest')
            expect(snakeToCamelCase('test_test_test')).toBe('testTestTest')
            expect(snakeToCamelCase('test_test_test_test')).toBe('testTestTestTest')
        })
    })

    describe('formatValidationErrors', () => {
        it('should return null if no errors are passed', () => {
            expect(formatValidationErrors([])).toBeNull()
        })

        it('should return an object with paths and attributes as keys and error messages as values', () => {
            const errors = [
                { message: 'test', path: ['base', 'property'] },
                { attribute: 'test2', message: 'test2', path: null },
                { explanation: 'test3', path: ['test3'] },
                { attribute: 'test4' }
            ]
            expect(formatValidationErrors(errors)).toEqual({
                'base.property': 'test',
                'test2': 'test2',
                'test3': 'test3',
                'test4': 'Invalid'
            })
        })
    })

    describe('NotFoundError', () => {
        it('should set the correct name and message', () => {
            const message = 'Test'
            const clientError = new ClientError(
                { errors: [{ message, locations: [], path: [] } as unknown as GraphQLError], status: 200 },
                { query: '' }
            )
            const notFoundError = new NotFoundError(clientError)
            expect(notFoundError.name).toBe(ErrorType.NotFound)
            expect(notFoundError.message).toBe(message)
        })
    })

    describe('ServerError', () => {
        it('should set the correct name and message', () => {
            const message = 'Test'
            const clientError = new ClientError(
                { errors: [{ message, locations: [], path: [] } as unknown as GraphQLError], status: 200 },
                { query: '' }
            )
            const serverError = new ServerError(clientError)
            expect(serverError.name).toBe(ErrorType.Server)
            expect(serverError.message).toBe(message)
        })
    })

    describe('ValidationError', () => {
        it('should set the correct name and message', () => {
            const message = 'Test'
            const validationError = new ValidationError([{ message, attribute: 'test' }])
            expect(validationError.name).toBe(ErrorType.Validation)
            expect(validationError.message).toBe('Validation error')
            expect(validationError.details).toEqual({ test: message })
        })
    })

    describe('mapToLibraryErrorTypes', () => {
        it('should return a NotFoundError if the error is a NotFoundError', () => {
            const message = 'Test'
            const clientError = new ClientError(
                { errors: [{ message, extensions: { code: 'RECORD_NOT_FOUND' } } as unknown as GraphQLError], status: 200 },
                { query: '' }
            )
            expect(mapToLibraryErrorTypes(clientError).name).toBe(ErrorType.NotFound)
        })

        it('should return a ValidationError if the error is a ValidationError', () => {
            const message = 'Test'
            const clientError = new ClientError(
                {
                    errors: [{
                        message, extensions: {
                            problems: [{
                                path: ['test'],
                                explanation: 'test explanation'
                            }]
                        }
                    } as unknown as GraphQLError], status: 200
                },
                { query: '' }
            )
            const error = mapToLibraryErrorTypes(clientError)
            expect(error.name).toBe(ErrorType.Validation)
            expect((error as ValidationError).details).toEqual({ test: 'test explanation' })
        })

        it('should return a ServerError if the error is not matched with any type', () => {
            const message = 'Test'
            const clientError = new ClientError(
                { errors: [{ message } as unknown as GraphQLError], status: 200 },
                { query: '' }
            )
            const error = mapToLibraryErrorTypes(clientError)
            expect(error.name).toBe(ErrorType.Server)
            expect(error.message).toBe(message)
        })
    })
})