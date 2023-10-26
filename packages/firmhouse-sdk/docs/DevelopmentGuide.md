# Development Guide

## Updating GraphQL Schema

- After you create or update `.graphql` files, you need to run graphql codegen to update the generated typescript files.

```bash
nx run firmhouse-sdk:graphql-codegen
```

> Note that, it uses `NX_PROJECT_ACCESS_TOKEN` environment variable. You can create `.env` file in the root of the project and set the variable there. See `.env.example` for an example.
