# Firmhouse SDK

A JavaScript / TypeScript SDK for interacting with the Firmhouse GraphQL API in a structured and type-safe way.

The Firmhouse SDK is designed to make it easier for developers to interact with the Firmhouse API by providing a fully typed interface and handling errors in a structured way.

## Features

- Fully typed SDK with TypeScript, so you don't have to worry about field names and types.
- Provides smooth IDE experience with auto-completion and type hints.
- Handles errors in a structured way.
- Supports both Storefront and Write access tokens and restricts operations based on the access type.
- Gives you the option to include/exclude related resources in the response, without writing messy GraphQL queries.

## Install

```bash
npm install @firmhouse/firmhouse-sdk
```

## Documentation

You can find the documentation for the SDK [here](https://developer.firmhouse.com/sdks/firmhouse-sdk).

## Usage

```typescript
import { FirmhouseClient, assignSubscriptionUtils } from '@firmhouse/firmhouse-sdk';
const apiToken = 'YOUR_PROJECT_ACCESS_TOKEN';

const client = new FirmhouseClient({
  apiToken,
});

const { results: products } = await firmhouseClient.products.fetchAll();
const { results: plans } = await firmhouseClient.plans.fetchAll();
const product = await firmhouseClient.products.fetchById('123');
const token = await firmhouseClient.carts.createCartToken();
await firmhouseClient.carts.addProduct(cartToken, {
  productId: products[0].id,
  quantity: 2,
});

const writeAccessApiToken = 'YOUR_PROJECT_ACCESS_TOKEN_WITH_WRITE_ACCESS';
const writeAccessClient = new FirmhouseClient({
  apiToken:
  accessType: Access.write,
});

const project = await writeAccessClient.projects.getCurrent({
  extraFields: true,
  promotions: true,
  taxRates: true
});

const invoices = await writeAccessClient.invoices.fetchAll();

await firmhouseClient.selfServiceCenterToken.create('subscriber@example.com', 'https://myapp.com/ssc/token-login')
const subscription = await client.subscriptions.getBySelfServiceCenterLoginToken(
  selfServiceCenterLoginToken
);

const subscriptionWithUtils = assignSubscriptionUtils(subscription);
const upcomingOrderDate = subscriptionWithUtils.getClosestUpcomingOrderDate();
const upcomingOrderProducts = subscriptionWithUtils.getClosestUpcomingOrderOrderedProducts();

```

## Development Guide

You can check the [Development Guide](./docs/DevelopmentGuide.md) for learning about the conventions and tools used in the project.
