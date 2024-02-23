function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

/**
 * @internal
 */
export function arrayFilterNulls<T>(
  array?: (T | null | undefined)[] | null
): T[] {
  return array?.filter(notEmpty) ?? [];
}

/**
 * @internal
 */
export function filterNullsFromPaginatedResult<T>(
  result?: {
    nodes: (T | null)[] | null;
    totalCount: number | null;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  } | null
) {
  return {
    ...result,
    nodes: arrayFilterNulls(result?.nodes),
  };
}

/**
 * @internal
 * @param value
 * @returns
 */
export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
