# Development Guide

## Updating GraphQL Schema

- After you create or update `.graphql` files, you need to run graphql codegen to update the generated typescript files.

```bash
nx run firmhouse-sdk:graphql-codegen
```

> Note that, it uses `NX_PROJECT_ACCESS_TOKEN` environment variable. You can create `.env` file in the root of the project and set the variable there. See `.env.example` for an example.

## Releases and Changelog

- The repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to generate changelog and versions automatically. To make sure that commits are in the correct format, commitizen is configured to run when you run `git commit`. You can pick the correct commit type from the list and commitizen will ask you the rest of the questions to generate the commit message.

## Documentation

- The repo uses [api-extractor](https://api-extractor.com/) to generate rolled up `.d.ts` files and documentation. It's automatically run when `npx nx affected --target release --all` is run from the Github Actions workflow. You can also run it locally by running `nx run firmhouse-sdk:api-extractor` command.

TSDoc conventions should be used for writing comments to make sure that the documentation is generated correctly. See [TSDoc](https://tsdoc.org/) for more information.
