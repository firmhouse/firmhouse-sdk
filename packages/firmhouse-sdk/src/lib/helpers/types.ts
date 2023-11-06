/**
 * @public
 * Resolves all modifiers in a type.
 * @remarks
 * e.g. \{ foo: string \} & \{ bar: number \} =\> \{ foo: string, bar: number\}
 */
export type ResolveObject<T extends object> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;
