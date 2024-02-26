/**
 * SDK for interacting with the Firmhouse GraphQL API.
 *
 * @example
 *
 * ## Usage
 *
 * You can use both Storefront and Write access tokens to interact with the Firmhouse API.
 * Depending on the access type, you can perform different operations.
 * If you try to perform an operation that is not allowed by the access type, you will receive an error.
 *
 * ### Storefront Access
 * ```typescript
 * import { FirmhouseClient, Access } from '@firmhouse/firmhouse-sdk';
 *
 * const client = new FirmhouseClient({
 *  apiToken: "<storefront-access-token>",
 * });
 *
 * const { results } = await client.products.fetchAll();
 * const cart = await client.carts.create();
 * const { orderedProduct, subscription } = await client.carts.addProduct(cart.token, { productId: results[0].id, quantity: 1 });
 * ```
 *
 * ### Write Access
 *
 * ```typescript
 * import { FirmhouseClient, Access, InvoiceStatusEnum } from '@firmhouse/firmhouse-sdk';
 *
 * const client = new FirmhouseClient({
 *  apiToken: "<write-access-token>",
 *  accessType: Access.write
 * });
 *
 * const subscription = await client.subscriptions.get("subscription-token");
 * const invoices = await client.invoices.fetchAll({ statuses: [InvoiceStatusEnum.Pending, InvoiceStatusEnum.Paid], subscriptionId: subscription.id }, {
 *  invoiceLineItems: true,
 *  payment: true
 * });
 *
 *
 * ```
 *
 * @packageDocumentation
 */
export * from './lib/firmhouse';
