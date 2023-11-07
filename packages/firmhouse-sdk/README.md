# firmhouse-sdk

## Install

```bash
npm install @firmhouse/firmhouse-sdk
```

## Usage

```typescript
import { FirmhouseClient } from '@firmhouse/firmhouse-sdk';
const apiToken = 'YOUR_PROJECT_ACCESS_TOKEN';

const client = new FirmhouseClient({
  apiToken,
});

const { results } = await client.products.fetchAll();
const product = await client.products.fetchById('123');
const token = await client.subscriptions.createSubscriptionToken();
```
