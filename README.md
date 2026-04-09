# Next.js Clean Architecture

A production-ready Next.js 16.1.6 and react js 19.2.3 project implementing clean architecture principles.

This architecture ensures:
- **Clear separation of concerns** - Each layer has a specific responsibility
- **Testability** - Business logic is isolated from HTTP handlers
- **Maintainability** - Consistent structure across modules
- **Scalability** - Easy to add new features and modules
- **Type Safety** - Full TypeScript support with strict mode

## 🎯 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### 2. Configuration

Update `.env.local`:
```env
DATABASE_URL=mongodb://localhost:27017/cleanarch
JWT_SECRET=your-secret-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/v1/              # API routes (versioned)
│   │   ├── auth/            # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── me/route.ts
│   │   └── health/route.ts   # Health check
│   ├── (protected)/         # Protected pages group
│   │   └── dashboard/       # Dashboard page
│   ├── (public)/            # Public pages group
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
│
├── modules/                 # Business logic (organized by feature)
│   ├── auth/               # Authentication module
│   │   ├── auth.controller.ts    # HTTP request handling
│   │   ├── auth.service.ts       # Business logic
│   │   ├── auth.repository.ts    # Database operations
│   │   ├── auth.model.ts         # Schema definitions
│   │   ├── auth.validator.ts     # Input validation
│   │   ├── auth.types.ts         # TypeScript interfaces
│   │   └── index.ts              # Barrel export
│   └── product/            # Product management (placeholder)
│       └── index.ts
│
├── configs/                # Configuration management
│   ├── env.ts             # Environment variables
│   ├── db.ts              # Database config
│   ├── swagger.ts         # API documentation config
│   └── index.ts           # Barrel export
│
├── loaders/               # Application initialization
│   ├── db.loader.ts       # Database connection loader
│   ├── app.loader.ts      # App initialization
│   └── index.ts           # Barrel export
│
├── middlewares/           # HTTP middlewares
│   ├── auth.middleware.ts       # Authentication checks
│   ├── error.middleware.ts      # Error handling
│   ├── logger.middleware.ts     # Request logging
│   └── index.ts                 # Barrel export
│
├── integrations/          # External services
│   ├── redis/             # Cache integration
│   ├── email/             # Email service
│   ├── payment/           # Payment gateway (Stripe)
│   └── index.ts           # Barrel export
│
├── jobs/                  # Background tasks
│   └── cron.jobs.ts       # Scheduled jobs
│
├── workers/               # Queue workers
│   └── queue.worker.ts    # Job queue processor
│
├── utils/                 # Utility functions
│   ├── apiResponse.ts     # Standardized API responses
│   ├── apiError.ts        # Error handling utility
│   ├── constants.ts       # Constants
│   ├── localization.ts    # i18n utility
│   ├── validations.ts     # Validation helpers
│   └── index.ts           # Barrel export
│
├── lib/                   # Core libraries
│   ├── db.ts             # Database connection handler
│   ├── di.ts             # Dependency Injection container
│   ├── logger.ts         # Logging utility
│   └── index.ts          # Barrel export
│
└── types/                 # Global TypeScript definitions
    └── global.types.ts    # Shared interfaces
```

## 🚀 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/v1/auth/login` | User login | ❌ |
| POST | `/api/v1/auth/register` | User registration | ❌ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |
| GET | `/api/v1/health` | Health check | ❌ |

## ⚙️ Configuration

### Environment Variables

Create `.env.local` with required variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/cleanarch
JWT_SECRET=your-secret-key
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Lint code
```

### TypeScript Configuration

Absolute imports are configured to use `@/` alias:


