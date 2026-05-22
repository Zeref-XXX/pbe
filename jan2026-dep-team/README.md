# React Products App

This project is now a full-stack TypeScript application:

- A Vite + React frontend for browsing products, viewing details, bookmarking items, managing cart state, and submitting ratings.
- A Node.js + Express backend backed by MongoDB for serving product data from a seeded dataset.

The previous README described a frontend-only FakeStoreAPI app. That is no longer accurate for product data. Products are now fetched from the local backend at `http://localhost:5000`.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Redux + React Redux
- React Router v6
- Tailwind CSS
- Headless UI
- Vitest + Testing Library

### Backend

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose

## Project Structure

```text
.
|-- src/                 # React frontend
|-- backend/             # Express API and database seed scripts
|-- public/
|-- package.json         # Frontend scripts
`-- backend/package.json # Backend scripts
```

## Features

- Login-gated frontend flow
- Product listing page with search, category filters, and sorting
- Product details page with:
  - dynamic product images by color
  - cart actions
  - bookmark toggle
  - rating submission in 0.5 increments
- Local cart and bookmark persistence in the frontend
- MongoDB-backed product catalog served by the backend
- Seed script to import product data from `backend/base-data.rawproducts.json`

## Backend API

The backend currently exposes these product routes:

- `GET /products` - fetch all products
- `GET /products/:id` - fetch a single product
- `POST /products/:id/rating` - submit a rating between `0.5` and `5.0` in `0.5` steps

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string

## Installation

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Environment Variables

Create a `backend/.env` file with at least:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

`PORT` is optional. If omitted, the backend defaults to `5000`.

## Seed the Database

Before starting the app for the first time, seed MongoDB with the transformed product dataset:

```bash
cd backend
npm run seed
```

This script:

- reads `backend/base-data.rawproducts.json`
- transforms the source data into the app's product shape
- clears the existing `products` collection
- inserts the new seeded records

## Running the App

Start the backend:

```bash
cd backend
npm run dev
```

In a separate terminal, start the frontend:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Available Scripts

### Frontend

- `npm run dev` - start the Vite dev server
- `npm run build` - type-check and build the frontend
- `npm run preview` - preview the production build
- `npm run test` - run frontend tests with Vitest coverage

### Backend

- `npm run dev` - start the Express server in watch mode
- `npm run start` - start the backend with `tsx`
- `npm run seed` - seed MongoDB with product data
- `npm run build` - compile backend TypeScript

Run backend scripts from the `backend/` directory.

## Notes

- The frontend API helper is currently configured to call `http://localhost:5000` directly.
- Product filtering, sorting, and search are handled on the frontend after fetching the product list.
- Rating updates are persisted through the backend and reflected in MongoDB.

## Testing

Run frontend tests from the project root:

```bash
npm run test
```

## Code Quality

- Prettier is configured in the project
- TypeScript is used on both frontend and backend

If you use VS Code, enable format-on-save and install your preferred Prettier extension.
