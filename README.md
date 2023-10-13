# Firmhouse SDK

## SDK

## Example Apps

### Next.js

#### App Router

- Example using the App Router can be found [here](./examples/nextjs/storefront-app-router).

- It needs a project access token with Storefront Access type of a project with Product as a Service subscription. You can configure that through  `NEXT_PUBLIC_PROJECT_ACCESS_TOKEN` environment variable. You can create `.env.local` file in the root of the project and set the variable there. See `example.env.local` for an example.

- You can start the example app by running:

    ```bash
    nx run nextjs-storefront-app-router:serve
    ```

- You can check the example at https://firmhouse-sdk-nextjs-app-router.vercel.app/

#### Pages Router

- Example using the Pages Router can be found [here](./examples/nextjs/storefront-pages-router).

- It needs a project access token with Storefront Access type of a project with Smart Order-based subscription. You can configure that through  `NEXT_PUBLIC_ORDER_BASED_PROJECT_ACCESS_TOKEN` environment variable. You can create `.env.local` file in the root of the project and set the variable there. See `example.env.local` for an example.

- You can start the example app by running:

    ```bash
    nx run nextjs-storefront-pages-router:serve
    ```

- You can check the example at https://firmhouse-sdk-nextjs-pages-router.vercel.app/