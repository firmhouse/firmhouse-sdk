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
 * @param value
 * @returns
 */
export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * @internal
 */
export function isEdgeRuntime(): boolean {
  return typeof EdgeRuntime === 'string';
}
