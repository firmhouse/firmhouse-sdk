# headless-react

This package is a set of fully customizable React components that can be used to build a headless UI for a Firmhouse Storefront.

You can find the full documentation at [https://developer.firmhouse.com/sdks/headless-react](https://developer.firmhouse.com/~/changes/1JxsjBJuo94JOj1BO5j9/sdks/headless-react)

> **Note:** This package is still in development and can be subject to breaking changes.

## Installation

```bash
npm install @firmhouse/firmhouse-sdk @firmhouse/headless-react
```

## Usage

```jsx
import { CheckoutForm, FirmhouseCartProvider, OrderedProductsList, OrderSummary } from '@firmhouse/headless-react';

<FirmhouseCartProvider apiToken={apiToken}>
  <div>
    <CheckoutForm />
  </div>
  <div>
    <OrderedProductsList onlyOneTimeProducts />
    <br />
    <OrderedProductsList onlyRecurringProducts />
    <OrderSummary />
  </div>
</FirmhouseCartProvider>;
```
