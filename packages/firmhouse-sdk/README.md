# Firmhouse SDK

A JavaScript / TypeScript SDK for interacting with the Firmhouse GraphQL API in a structured and type-safe way.

The Firmhouse SDK is designed to make it easier for developers to interact with the Firmhouse API by providing a fully typed interface and handling errors in a structured way.

## Features

- Fully typed SDK with TypeScript, so you don't have to worry about field names and types.
- Provides smooth IDE experience with auto-completion and type hints.
- Handles errors in a structured way.
- Supports both Storefront and Write access tokens and restricts operations based on the access type.
- Gives you the option to include/exclude related resources in the response, without writing messy GraphQL queries.
- Supports applying discount codes and calculating discounted cart totals.
- Provides helpers for subscriptions, ordered products, and extra fields.

## Install

```bash
npm install @firmhouse/firmhouse-sdk
```

## Documentation

You can find the documentation for the SDK [here](https://developer.firmhouse.com/sdks/firmhouse-sdk).

## Usage

```typescript
import { Access, FirmhouseClient } from '@firmhouse/firmhouse-sdk';
import { assignSubscriptionUtils, calculateCartTotals, mapExtraFieldsByFieldId } from '@firmhouse/firmhouse-sdk/utils';

const apiToken = 'YOUR_PROJECT_ACCESS_TOKEN';

const client = new FirmhouseClient({
  apiToken,
});

const { results: products } = await client.products.fetchAll();
const { results: plans } = await client.plans.fetchAll();
const product = await client.products.fetchById('123');
const cartToken = await client.carts.createCartToken();
await client.carts.addProduct(cartToken, {
  productId: products[0].id,
  quantity: 2,
});

// Apply a discount code and calculate the discounted cart totals.
await client.carts.applyDiscountCode(cartToken, 'WELCOME10');
const cart = await client.carts.get(cartToken, {
  appliedPromotions: {
    includeRelations: {
      promotion: true,
      discountCode: true,
    },
  },
});
const {
  payNowSubtotalCents, // Signup amount before discount.
  payNowDiscountCents, // Discount applied at signup.
  payNowTotalCents, // Signup amount after discount.
  monthlySubtotalCents, // Monthly amount before discount.
  monthlyDiscountCents, // Discount applied each month.
  monthlyTotalCents, // Monthly amount after discount.
} = calculateCartTotals(cart);
await client.carts.removeDiscountCode(cartToken);

const writeAccessApiToken = 'YOUR_PROJECT_ACCESS_TOKEN_WITH_WRITE_ACCESS';
const writeAccessClient = new FirmhouseClient({
  apiToken: writeAccessApiToken,
  accessType: Access.write,
});

const project = await writeAccessClient.projects.getCurrent({
  extraFields: true,
  promotions: true,
  taxRates: true,
});

const invoices = await writeAccessClient.invoices.fetchAll();

await client.selfServiceCenterToken.create('subscriber@example.com', 'https://myapp.com/ssc/token-login');
const selfServiceCenterLoginToken = 'TOKEN_RECEIVED_FROM_THE_LOGIN_LINK';
const subscription = await writeAccessClient.subscriptions.getBySelfServiceCenterLoginToken(selfServiceCenterLoginToken);

const subscriptionWithUtils = assignSubscriptionUtils(subscription);
const upcomingOrderDate = subscriptionWithUtils.getClosestUpcomingOrderDate();
const upcomingOrderProducts = subscriptionWithUtils.getClosestUpcomingOrderOrderedProducts();

const extraFieldsById = mapExtraFieldsByFieldId(subscription.extraFields);
const extraFieldAnswer = extraFieldsById['EXTRA_FIELD_ID'];
```

`calculateCartTotals` uses the largest active promotion when multiple
promotions are present; promotions do not stack. Discounts are capped at the
subtotal, and shipping is not included.

## Development Guide

You can check the [Development Guide](./docs/DevelopmentGuide.md) for learning about the conventions and tools used in the project.
