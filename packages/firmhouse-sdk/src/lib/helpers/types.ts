import { GetSubscriptionWithQuery } from '../resources/subscriptions/subscriptions.generated';

/**
 * @public
 * Resolves all modifiers in a type.
 * @remarks
 * e.g. \{ foo: string \} & \{ bar: number \} =\> \{ foo: string, bar: number\}
 */
export type ResolveObject<T extends object> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;

/**
 * @public
 * Order
 */
export type OrderType = ResolveObject<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<GetSubscriptionWithQuery['getSubscription']>['ordersV2']
      >['nodes']
    >[0]
  >
>;
