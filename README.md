# Firmhouse SDK

## SDK

You can find the SDK documentation [here](./packages/firmhouse-sdk/README.md).

## Example Apps

### Next.js

#### App Router

- Example using the App Router can be found [here](./examples/nextjs/storefront-app-router).

- It needs a project access token with Storefront Access type of a project with Product as a Service subscription. You can configure that through `NEXT_PUBLIC_PLAN_BASED_FIRMHOUSE_STOREFRONT_ACCESS_TOKEN` environment variable. You can create `.env.local` file in the root of the project and set the variable there. See `example.env.local` for an example.

- You can start the example app by running:

  ```bash
  nx run nextjs-storefront-app-router:serve
  ```

- You can check the example at https://firmhouse-sdk-nextjs-app-router.vercel.app/

#### Pages Router

- Example using the Pages Router can be found [here](./examples/nextjs/storefront-pages-router).

- It needs a project access token with Storefront Access type of a project with Smart Order-based subscription. You can configure that through `NEXT_PUBLIC_ORDER_BASED_FIRMHOUSE_STOREFRONT_ACCESS_TOKEN` environment variable. You can create `.env.local` file in the root of the project and set the variable there. See `example.env.local` for an example.

- You can start the example app by running:

  ```bash
  nx run nextjs-storefront-pages-router:serve
  ```

- You can check the example at https://firmhouse-sdk-nextjs-pages-router.vercel.app/

#### Self Service Center App

- A custom self service center example can be found [here](./examples/nextjs/self-service-center).

- It can be used with both plan based and order based projects. It needs write access token for both those project types.

- The following environment variables should be configured:

`NEXT_ORDER_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN`: Write access token for smart order based example

`NEXT_PLAN_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN`: Write access token for product as a service example

`NEXT_SSC_JWT_SIGNING_KEY`: JWT signing secret for the Self service center login tokens.

`NEXT_PUBLIC_SITE_URL`: Base URL for the self service center. It will be used for the email link.

- You can start the example app by running:

  ```bash
  nx run nextjs-self-service-center:serve
  ```

- You can check the example at https://firmhouse-sdk-self-service-center.vercel.app/
