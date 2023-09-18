import { formatValidationErrors, snakeToCamelCase } from '@firmhouse/firmhouse-sdk/lib/helpers/errors'

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
                { attribute: 'test', message: 'test', path: ['base'] },
                { attribute: 'test2', message: 'test2', path: null },
            ]
            expect(formatValidationErrors(errors)).toEqual({
                'base.test': 'test',
                'test2': 'test2',
            })
        })

    })
})