function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function arrayFilterNulls<T>(array?: (T | null | undefined)[] | null): T[] {
  return array?.filter(notEmpty) ?? [];
}