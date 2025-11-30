# Supabase Integration Checklist

## Pre-Integration Steps
- [ ] Create Supabase project (free tier available)
- [ ] Get Project URL and Anon Key from Settings → API
- [ ] Add credentials to `.env`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  ```

## Database Setup
- [ ] Open Supabase SQL Editor
- [ ] Run all SQL from `apps/web/lib/database-schema.sql`
- [ ] Verify tables created: venues, raw_submissions, users, etc.
- [ ] Check enums created: user_role, submission_status, risk_level, etc.
- [ ] Verify RLS policies are enabled on public tables

## Code Integration
- [ ] ✅ Supabase client created: `lib/supabase.ts`
- [ ] ✅ Auth service implemented: `lib/services/authService.ts`
- [ ] ✅ Venue service implemented: `lib/services/venueService.ts`
- [ ] ✅ RAW service implemented: `lib/services/rawService.ts`
- [ ] ✅ Zustand stores created: `lib/stores/`
- [ ] ✅ Dependencies installed: `pnpm install`

## Next: UI Implementation
- [ ] Create Login/Signup pages
- [ ] Create Venue Search/List page
- [ ] Create RAW Creation form (4-step wizard)
- [ ] Create RAW Detail/View page
- [ ] Create Approval dashboard
- [ ] Connect pages to services

## Quick Integration Examples

### Sign Up User
```typescript
import { authService } from '@/lib/services/authService'

const handleSignUp = async (email, password, fullName, role) => {
  try {
    await authService.signUp(email, password, fullName, role)
    // User created, redirect to login
  } catch (error) {
    console.error('Sign up failed:', error)
  }
}
```

### Load All Venues
```typescript
import { venueService } from '@/lib/services/venueService'
import { useVenueStore } from '@/lib/stores/venueStore'

useEffect(() => {
  const loadVenues = async () => {
    const venues = await venueService.getAllVenues()
    useVenueStore.setState({ venues })
  }
  loadVenues()
}, [])
```

### Create a RAW
```typescript
import { rawService } from '@/lib/services/rawService'
import { useAuthStore } from '@/lib/stores/authStore'

const handleCreateRAW = async (venueId) => {
  const user = useAuthStore.getState().user
  const newRAW = await rawService.createRAW({
    user_id: user.id,
    venue_id: venueId,
    status: 'draft',
    hazards: [],
  })
  return newRAW
}
```

### Add Hazard to RAW
```typescript
const handleAddHazard = async (rawId, severity, likelihood, description) => {
  const hazard = await rawService.addHazardToRAW({
    raw_id: rawId,
    hazard_description: description,
    severity,
    likelihood,
    control_measures: '',
  })
  return hazard
}
```

### Submit RAW for Approval
```typescript
const handleSubmitRAW = async (rawId) => {
  const user = useAuthStore.getState().user
  const updated = await rawService.submitRAW(rawId, user.id)
  // Approvers will receive notifications
  return updated
}
```

## Files Created

```
apps/web/
├── lib/
│   ├── supabase.ts                    # Supabase client
│   ├── database-schema.sql            # Full SQL schema
│   ├── stores/
│   │   ├── authStore.ts               # Auth state
│   │   ├── venueStore.ts              # Venue state
│   │   └── rawStore.ts                # RAW state
│   └── services/
│       ├── authService.ts             # Auth CRUD
│       ├── venueService.ts            # Venue CRUD
│       └── rawService.ts              # RAW CRUD
├── package.json                        # Updated with @supabase, zustand
└── [existing pages]
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional (for local API backend)
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

## Testing the Integration

1. Start dev server: `pnpm dev`
2. Open browser: `http://localhost:3000`
3. Try signing up with test email/password
4. Check Supabase dashboard:
   - Auth → Users should show your test account
   - Table Editor → users table should show new user profile
5. Test venue operations
6. Test RAW creation

## Common Commands

```bash
# Install dependencies
cd apps/web && pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# View database schema
# Go to Supabase SQL Editor → database-schema.sql
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase URL" | Check .env has NEXT_PUBLIC_ prefix, restart server |
| "Permission denied" | Ensure RLS policies are created in database |
| "Auth failed" | Check email/password combination, clear cookies |
| "Venues not loading" | Check venues table has data, verify RLS allows SELECT |

---

**Status**: Ready to build UI pages
**Next Task**: Create authentication and venue pages
