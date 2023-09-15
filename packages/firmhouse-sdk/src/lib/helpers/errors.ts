export function snakeToCamelCase(str: string) {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    );
};

/**
 * Formats validation errors as a single object with paths as keys and error messages as values
 * @param errors Validation errors
 * @returns Object with paths as keys and error messages as values
 */
export function formatValidationErrors<ErrorT extends { attribute: string, message: string, path?: string[] | null }>(errors: ErrorT[]): Record<string, string> | null {
    if (errors.length === 0) return null
    return errors.reduce((res, error) => {
        const path = snakeToCamelCase([...(error.path ?? []), error.attribute].join('.'));
        return {
            ...res,
            [path]: error.message
        }
    }, {})
}
