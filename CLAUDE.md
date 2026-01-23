# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint with Next.js core-web-vitals + TypeScript
```

## Architecture Overview

Personal finance dashboard built with Next.js 16 App Router, React 19, and TypeScript.

### Tech Stack
- **Authentication:** NextAuth.js 5 (Google OAuth with email allowlist via `ALLOWED_EMAILS` env var)
- **Database:** Supabase (PostgreSQL)
- **Charts:** Recharts
- **Styling:** CSS modules with global styles

### Route Structure
- `/login` - Public auth page
- `/(dashboard)/*` - Protected routes: home, bills, debts, income, savings, transactions
- `/api/*` - Server-side endpoints for CRUD operations (all require authentication)

### Key Patterns

**Data Flow:**
Components → `useDashboardData` hook → `fetch*` functions → API routes → Supabase → mappers → response

**Context Providers** (wrapped at dashboard layout level):
- `CurrencyContext` - CAD/USD toggle with localStorage persistence
- `MonthContext` - Month navigation for filtering data

**Database Mappers** (`src/lib/supabaseMappers.ts`):
Supabase uses snake_case, app uses camelCase. Mappers convert between formats for each entity (debts, bills, savings, income, transactions).

**API Pattern:**
All routes in `src/app/api/` check `await auth()` for session, filter by `user_id`, return 401 if unauthorized. GET reads all user data, POST replaces all user data for that entity.

### Component Organization
Each feature (bills, debts, income, savings, transactions) has:
- `[Entity]Card.tsx` - Display component
- `[Entity]Form.tsx` - Create/edit form
- `[Entity].css` - Feature-specific styles
- `index.ts` - Barrel export

### Important Files
- `src/auth.ts` - NextAuth config with Google provider and email allowlist
- `src/lib/hooks/useDashboardData.ts` - Central data aggregation hook
- `src/lib/supabase.ts` - Supabase client initialization
- `src/types/index.ts` - Domain type definitions

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
ALLOWED_EMAILS  # Comma-separated email allowlist
```
