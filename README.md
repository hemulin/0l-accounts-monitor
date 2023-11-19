# 0L Account Data Viewer

This project is a Nuxt 3 application designed to monitor accounts data on 0L. It features a responsive table that allows users to view various account details, sort data by different columns, and export the information to a CSV file.

![screenshot](https://i.imgur.com/LzQREoE.png)

## Setup

First, clone the repository to your local machine. To get started, ensure you have Nuxt 3 installed and then install the dependencies:

```bash
# Using npm
npm install

# Using pnpm
pnpm install

# Using yarn
yarn install

# Using bun
bun install
```

## Configuration

1. **Account Data File**: The project uses `accounts.json` to load account data. For security reasons, this file is not included in the repository. Instead, you can find `accounts.example.json` in the root directory, which contains sample data.

2. To use your own data, rename `accounts.example.json` to `accounts.json` and replace the sample data with your actual account data.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm run dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

## Production

Build the application for production:

```bash
# Using npm
npm run build

# Using pnpm
pnpm run build

# Using yarn
yarn build

# Using bun
bun run build
```

Locally preview the production build:

```bash
# Using npm
npm run preview

# Using pnpm
pnpm run preview

# Using yarn
yarn preview

# Using bun
bun run preview
```

## Deployment

For information on deploying the application, refer to the [Nuxt 3 deployment documentation](https://nuxt.com/docs/getting-started/deployment).
