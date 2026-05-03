# Blog Application (Next.js + Clean Architecture)

This project is a full-stack blog/admin app built with Next.js App Router, React Query, MongoDB, and a modular clean-architecture style.  
It includes authentication, posts with comments, and CRUD flows for categories and products.

## Tech Stack

- Next.js `16.1.6` and React `19.2.3`
- TypeScript and ESLint
- MongoDB with Mongoose
- React Query for client-side data fetching/caching
- JWT-based auth
- Optional file storage integration via DigitalOcean Spaces (S3-compatible)

## Features

- Auth: register, login, and current-user (`/api/v1/auth/me`)
- Protected dashboard layout with sidebar navigation
- Posts listing with infinite scroll
- Create post flow (admin UI) with tags and optional image upload
- Post details page with comments and comment count
- Categories CRUD
- Products CRUD (linked to categories)
- Health check endpoint for service readiness

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Create environment file

Create `.env.local` in the project root:

```env
# App
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=mongodb://localhost:27017/cleanarch
DB_NAME=cleanarch

# Auth
JWT_SECRET=change-this-in-production
JWT_EXPIRY=15m

# Optional logging/cors/api defaults
LOG_LEVEL=info
LOG_FORMAT=json
CORS_ORIGIN=*
API_VERSION=v1
API_PREFIX=/api

# Uploads
UPLOAD_DIR=public/upload

# Optional DigitalOcean Spaces (S3-compatible)
DO_SPACES_NAME=
DO_SECRET_KEY=
DO_ACCESS_KEY=
DO_REGION=
DO_ENDPOINT=
DO_PROTOCOL=https
```

### 3) Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev            # Start development server (Turbo)
npm run build          # Build for production
npm run start          # Start production build
npm run lint           # Run ESLint
npm run test           # Run Jest tests
npm run test:coverage  # Run Jest with coverage
npm run sonar          # Run Sonar scanner
```

## API Routes

### Health

- `GET /api/v1/health`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Posts & Comments

- `GET /api/v1/post`
- `POST /api/v1/post`
- `GET /api/v1/post/:id`
- `GET /api/v1/post/:id/comments`
- `GET /api/v1/post/:id/comments/counts`
- `GET /api/v1/comment`
- `POST /api/v1/comment`

### Categories

- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `GET /api/v1/categories/:id`
- `PUT /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`

### Products

- `GET /api/v1/products`
- `POST /api/v1/products`
- `GET /api/v1/products/:id`
- `PUT /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

## App Pages

- Public routes:
  - `/` (redirects to login/dashboard depending on token)
  - `/login`
  - `/register`
- Protected routes:
  - `/dashboard`
  - `/posts`
  - `/posts/[postId]`
  - `/posts/serverposts`
  - `/categories`
  - `/products`

## Project Structure (high level)

```text
src/
  app/              # App Router pages + API route handlers
  modules/          # Feature modules (auth/post/comment/category/product)
  hooks/            # React Query hooks
  components/       # UI + feature components
  configs/          # env/db/swagger config
  loaders/          # app/db bootstrap loaders
  middlewares/      # auth/error/logger middleware utilities
  integrations/     # storage/email/payment/redis integrations
  jobs/ workers/    # background jobs and worker entry points
  utils/ lib/       # shared utilities and infrastructure helpers
```

## Notes

- The project uses `@/` path alias for imports.
- Authentication token is currently stored client-side and sent as `Authorization: Bearer <token>`.
- In production, ensure strong values for `JWT_SECRET` and secure environment handling.
