import { ClientError } from 'graphql-request';

/**
 * @internal
 * @param str - String value in snake case
 * @returns String value in camel case
 */
export function _snakeToCamelCase(str: string) {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

/**
 * @internal
 * Formats validation errors as a single object with paths as keys and error messages as values
 * @param errors - Validation errors
 * @returns Object with paths as keys and error messages as values
 */
export function _formatValidationErrors<
  ErrorT extends {
    attribute?: string;
    message?: string;
    explanation?: string;
    path?: string[] | null;
  }
>(errors: ErrorT[]): Record<string, string> | null {
  if (errors.length === 0) return null;
  return errors.reduce((res, error) => {
    const properties = error.path?.length ? error.path : [error.attribute];
    const path = _snakeToCamelCase(properties.join('.'));
    return {
      ...res,
      [path]: error.message ?? error.explanation ?? 'Invalid',
    };
  }, {});
}

/**
 * @public
 * Type of errors
 */
export enum ErrorType {
  NotFound = 'NotFoundError',
  Server = 'ServerError',
  Validation = 'ValidationError',
}

/**
 * @public
 * Not found (404) error
 */
export class NotFoundError extends Error {
  constructor(error: ClientError | string) {
    const message =
      typeof error === 'string'
        ? error
        : `${error.response.errors?.[0]?.message ?? 'Not found'}`;
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = ErrorType.NotFound;
  }
}

/**
 * @public
 * Server error(5xx)
 */
export class ServerError extends Error {
  constructor(error: ClientError | string) {
    const message =
      typeof error === 'string'
        ? error
        : `${error.response.errors?.[0]?.message ?? 'Server error'}`;
    super(message);
    Object.setPrototypeOf(this, ServerError.prototype);
    this.name = ErrorType.Server;
  }
}

/**
 * @public
 * Validation error (400)
 */
export class ValidationError extends Error {
  /**
   * All validation errors in \{[path]: error\} format
   */
  public readonly details: Record<string, string> | null;
  constructor(
    errors: { attribute: string; message: string; path?: string[] | null }[]
  ) {
    const message = `Validation error`;
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = ErrorType.Validation;
    this.details = _formatValidationErrors(errors);
  }
}

/**
 * @internal
 * @param error - Client error
 * @returns The error with type as {@link ErrorType}
 */
export function _mapToLibraryErrorTypes(error: ClientError) {
  if (error.response.errors?.[0]?.extensions?.code === 'RECORD_NOT_FOUND') {
    return new NotFoundError(error);
  }
  const problems = error.response.errors?.[0]?.extensions?.problems;
  if (Array.isArray(problems)) {
    return new ValidationError(problems);
  }

  return new ServerError(error);
}
