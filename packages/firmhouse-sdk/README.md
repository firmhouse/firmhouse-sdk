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
- Provides an embedded Adyen checkout, so you can render the payment step in your own storefront instead of redirecting to a hosted payment page.

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

## Embedded Adyen checkout

Adyen projects can render the payment step inside your storefront with [Adyen Web
Drop-in](https://docs.adyen.com/online-payments/build-your-integration/) instead of
sending the customer to a hosted payment page. `client.payments` returns the browser-safe
session configuration, and the helpers turn it into the options that Drop-in expects.

Install `@adyen/adyen-web` yourself; the SDK does not depend on it.

```typescript
import { AdyenCheckout, Dropin } from '@adyen/adyen-web';
import { buildAdyenCheckoutOptions, buildAdyenDropinOptions, resolveAdyenCheckoutEntry } from '@firmhouse/firmhouse-sdk/utils';

// `payment` is null when the checkout has nothing to pay for.
const { payment } = await client.carts.createSubscription(cartToken, 'https://myshop.com/checkout', 'https://myshop.com/thanks');
if (!payment) return;

const entry = resolveAdyenCheckoutEntry(new URLSearchParams(window.location.search));

// The customer is back from a redirect, so the payment is already with Adyen.
if (entry.mode === 'redirect') {
  const status = await client.payments.waitForCheckoutStatus(cartToken, payment.token);
  if (status.paymentStatus === 'PAID' && status.successUrl) {
    window.location.assign(status.successUrl);
    return;
  }
}

// A fresh checkout, or a retry after the customer came back from a refused payment.
const session = await client.payments.createAdyenSession(cartToken, payment.token);
const checkout = await AdyenCheckout(buildAdyenCheckoutOptions(session));
new Dropin(checkout, buildAdyenDropinOptions(session)).mount('#dropin-container');
```

Payment methods such as iDEAL, Bancontact and a 3D Secure challenge take the customer to
another page, and Adyen returns them to your checkout with `sessionId` and
`redirectResult` query parameters. `resolveAdyenCheckoutEntry` detects that. Read the
outcome before anything else on a redirect return: Firmhouse confirms the payment through
a webhook that often lands before the customer is back, and a session cannot be created
for a payment that has already been paid.

To report the outcome to the browser sooner than the webhook does, you can hand the
result back to Adyen while the payment is still open:

```typescript
const checkout = await AdyenCheckout(buildAdyenCheckoutOptions(session, entry));
checkout.submitDetails({ details: { redirectResult: entry.redirectResult } });
```

Requesting a session for the same payment again returns the session that is still active,
so reloading the checkout page keeps the customer on the same payment, and a refused
payment can be retried in place.

Both `client.payments` methods need a storefront access token and the subscription token
of the checkout. `buildAdyenDropinOptions` mirrors the card and Google Pay settings of the
project, so settings such as requiring the cardholder name apply to your checkout without
hardcoding them. Merge your own presentational options into the result to style Drop-in.
