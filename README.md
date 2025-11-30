# SafeOps - Mobile-First Risk Assessment Worksheet Application

A comprehensive, modern web application for Singapore safety officers to create, manage, and track Risk Assessment Worksheets (RAWs) with venue hazard intelligence.

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (or via Homebrew on macOS)
- pnpm 10+ (via Corepack: `corepack use pnpm@latest`)
- Supabase account (free tier: [supabase.com](https://supabase.com))

### Setup (5 minutes)

1. **Clone and install**
   ```bash
   pnpm install
   ```

2. **Create Supabase project** and copy credentials to `.env`
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

3. **Run database schema** in Supabase SQL Editor (copy from `apps/web/lib/database-schema.sql`)

4. **Start dev server**
   ```bash
   pnpm dev
   ```
   - Frontend: http://localhost:3000
   - API: http://localhost:4000

## 📦 Project Structure

This is a **pnpm monorepo** with:

- `apps/web` — Next.js 14 frontend (React 18, TypeScript, Supabase)
- `apps/api` — Express backend (TypeScript, Prisma, PostgreSQL)
- `libs/types` — Shared TypeScript interfaces

## ✨ Features

- ✅ **User Authentication** - Role-based access (Safety Officer, Facility Manager, OIC/Approver, Admin)
- ✅ **Venue Management** - Search, create, and track all Singapore venues
- ✅ **RAW Creation** - 4-step wizard with hazard selection
- ✅ **Risk Calculation** - Auto-calculated RPN (Risk Priority Number)
- ✅ **Approval Workflow** - Submit, review, approve, or reject RAWs
- ✅ **Issue Tracking** - Track venue issues and FM alerts
- ✅ **Real-time Persistence** - All data synced with Supabase
- ✅ **Mobile-First Design** - Thumb-friendly 44px touch targets
- ✅ **Offline Support** - PWA ready

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed Supabase integration guide
- **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** - Step-by-step checklist with code examples
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - AI agent guide and product spec

## 🛠️ Makefile Commands

```bash
make install    # Install all workspace dependencies
make dev        # Run frontend + backend in parallel
make dev-web    # Run frontend only
make dev-api    # Run backend only
make stop       # Stop all dev servers
make seed       # Populate test data (PostgreSQL only)
make health     # Check server health
make generate   # Generate Prisma client
make migrate    # Run Prisma migrations
```

## 📖 Core Services & API

All backend operations are provided as services:

### Authentication Service
```typescript
import { authService } from '@/lib/services/authService'

await authService.signUp(email, password, fullName, role)
await authService.signIn(email, password)
const user = await authService.getCurrentUser()
authService.onAuthStateChange(callback)
```

### Venue Service
```typescript
import { venueService } from '@/lib/services/venueService'

const venues = await venueService.getAllVenues()
const results = await venueService.searchVenues('Orchard')
const hazards = await venueService.getVenueHazards(venueId)
const newVenue = await venueService.createVenue({...})
```

### RAW Service
```typescript
import { rawService } from '@/lib/services/rawService'

const raws = await rawService.getAllRAWs(userId)
const raw = await rawService.getRAWById(rawId)
const created = await rawService.createRAW({...})
await rawService.submitRAW(rawId, userId)
await rawService.approveRAW(rawId, approverId)
await rawService.rejectRAW(rawId, approverId, comments)
```

## 🗄️ Database Schema

9 tables with automatic relationships and calculations:

- **users** - Authentication profiles with roles
- **venues** - Singapore locations with safety status
- **raw_submissions** - Risk Assessment Worksheet submissions
- **raw_hazards** - Hazards within RAWs (with auto-calculated RPN)
- **venue_hazards** - Persistent hazard registry
- **issues** - Venue safety issues
- **attachments** - Photo evidence
- **notifications** - Real-time alerts
- **audit_logs** - Complete audit trail for PDPA compliance

All tables have Row-Level Security (RLS) enabled.

## 🎯 State Management

Zustand stores for reactive updates:

```typescript
import { useAuthStore } from '@/lib/stores/authStore'
import { useVenueStore } from '@/lib/stores/venueStore'
import { useRAWStore } from '@/lib/stores/rawStore'

// Use in components
const { user } = useAuthStore()
const { venues, selectedVenue } = useVenueStore()
const { raws, selectedRAW } = useRAWStore()
```

## 🔧 Development Commands

# start both web + api in dev (runs pnpm workspace dev)
make dev

# start single service
make dev-api
make dev-web

# stop dev servers (best-effort)
make stop

# health check for API
make health
```

If you prefer `npm` or `yarn`, update the workflow accordingly.
