# firmhouse-sdk

## Usage

```typescript
import { FirmhouseClient } from '@firmhouse/firmhouse-sdk'
const token = "YOUR_PROJECT_ACCESS_TOKEN"

const client = new FirmhouseClient({
  apiToken: token,
})

const products = await client.products.fetchAll()
const product = await client.products.fetchById('123')
await client.subscription.createCart()

```

