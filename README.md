# Pondus

Pondus is a full-stack SaaS-style platform built with a React/Vite frontend and an Express/MongoDB backend. It supports role-based access, multi-tenant company administration, subscription billing via Stripe, and password recovery workflows.

## Key Features

- React frontend powered by Vite and Redux Toolkit
- Role-based route protection for `admin`, `staff`, `employee`, and `user`
- Multi-tenant backend routing with tenant middleware
- Stripe payment flows and subscription management
- Email-based password reset via Nodemailer
- MongoDB data persistence with Mongoose
- Validation using Yup schemas
- Dynamic company information, products, plans, and billing pages

## Repository Structure

- `client/` - React application
  - `src/components/` - reusable UI and layout components
  - `src/pages/` - page-level views for admin, user, staff, employee, and common flows
  - `src/redux/` - global store slices
  - `src/services/` - API wrappers for backend routes
  - `src/router/` - route configuration and protected navigation

- `server/` - Express API backend
  - `configs/` - database, Stripe, email, and allowed origins configuration
  - `controllers/` - request handlers for users, subscriptions, Stripe, products, and company data
  - `middleware/` - authentication, tenant resolution, validation, and error handling
  - `models/` - Mongoose data models
  - `routes/` - API endpoints grouped by feature
  - `schemas/` - request validation schemas
  - `services/` - business logic and integrations
  - `utils/` - reusable helper utilities
  - `seed/` - seed scripts for admin and company data
  - `templates/` - email templates

## Getting Started

### Prerequisites

- Node.js 18+ (or compatible)
- npm 10+ (or compatible)
- MongoDB connection URI
- Stripe account and API key
- Gmail account or SMTP credentials for email notifications

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Configure environment variables

Create an `.env` file in `server/configs/` or update the existing file with values for your environment.

Example variables:

```env
PORT=5123
NODE_ENV=development
DB_URI=<your-mongodb-connection-string>
DB_URI2=<secondary-mongodb-connection-string>
ACCESS_TOKEN_SECRET=<jwt-access-token-secret>
REFRESH_TOKEN_SECRET=<jwt-refresh-token-secret>
ACCESS_TOKEN_EXPIRY_TIME=15m
REFRESH_TOKEN_EXPIRY_TIME=7d
SALT_ROUNDS=10
STRIPE_API_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
SENDER_EMAIL=<your-email@example.com>
SENDER_EMAIL_PASSWORD=<your-email-password>
ENCRYPTION_KEY=<encryption-key>
ADMIN_SERVER_BASE_URL=<admin-base-url>
```

> Do not commit secrets or production credentials to version control.

### Run the backend

```bash
cd server
npm run dev
```

The backend listens by default on `http://localhost:5123`.

### Run the frontend

```bash
cd client
npm run dev
```

The client will start on the Vite development server and connect to the API endpoints.

## Available Scripts

### Client

- `npm run dev` - start Vite development server
- `npm run build` - build production assets
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint checks across the React codebase

### Server

- `npm run dev` - start Express server with `nodemon`
- `npm start` - run the server with Node.js

## Development Workflow

1. Start the backend server first
2. Start the frontend client
3. Use the appropriate login routes for each role:
   - User login: `/login`
   - Staff login: `/company/login`
   - Admin interface: `/company/admin/dashboard`

## Notes

- The backend includes a tenant middleware layer to route requests based on company context.
- Webhook endpoints for Stripe require raw request body parsing and are specially handled in the Express middleware.
- The app uses `react-router-dom` for protected routing and role-specific navigation.

## License

This project is licensed under the MIT License.
