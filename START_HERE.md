# SafeOps - Start Here 🚀

Welcome! Your SafeOps MVP is fully scaffolded and ready to build. Follow these steps to get up and running.

## 📋 TL;DR (The Fastest Path)

1. **Create Supabase Project**: https://supabase.com (Region: Singapore)
2. **Copy credentials** to `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```
3. **Run SQL**: Go to Supabase SQL Editor → Paste `apps/web/lib/database-schema.sql` → Run
4. **Start dev**: `pnpm dev` → Open http://localhost:3000
5. **Build UI**: Use the services in `apps/web/lib/services/` to build pages

---

## 📚 Documentation (Read in This Order)

1. **[QUICK_START.md](./QUICK_START.md)** ← Start here!
   - 5-minute setup guide
   - Quick start commands
   - Testing checklist

2. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** ← Detailed setup
   - Step-by-step Supabase configuration
   - Troubleshooting guide
   - Advanced configuration options

3. **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** ← Code examples
   - Integration checklist
   - Copy-paste code examples
   - Common issues & solutions

4. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** ← Architecture
   - Complete architecture overview
   - All services documented
   - Complete feature roadmap

---

## 🎯 Your Next Steps

### Phase 1: Setup (Today - 30 minutes)
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy URL and Anon Key to `.env` file
- [ ] Run database schema SQL in Supabase
- [ ] Verify database tables created

### Phase 2: Core Pages (This Week)
- [ ] Create Login/Signup page using `authService`
- [ ] Create Venue Search page using `venueService`
- [ ] Create RAW Creation form (4-step wizard) using `rawService`
- [ ] Create RAW Detail view to display hazards

### Phase 3: Workflows (Next Week)
- [ ] Create Approval Dashboard for OICs
- [ ] Add RAW submission + approval UI
- [ ] Create Facility Manager dashboard
- [ ] Add issue tracking UI

### Phase 4: Polish (Following Week)
- [ ] Add photo attachments
- [ ] Implement real-time notifications
- [ ] Add admin console
- [ ] PDF export

---

## 📁 What You Have

### Backend Services (Ready to Use)

```typescript
// Authentication
import { authService } from '@/lib/services/authService'
await authService.signUp(email, password, fullName, role)
await authService.signIn(email, password)

// Venues
import { venueService } from '@/lib/services/venueService'
const venues = await venueService.getAllVenues()
const results = await venueService.searchVenues(query)

// RAWs
import { rawService } from '@/lib/services/rawService'
const raw = await rawService.createRAW({...})
await rawService.submitRAW(rawId, userId)
await rawService.approveRAW(rawId, approverId)
```

### State Management (Zustand Stores)

```typescript
import { useAuthStore } from '@/lib/stores/authStore'
import { useVenueStore } from '@/lib/stores/venueStore'
import { useRAWStore } from '@/lib/stores/rawStore'

// Use in your components
const { user } = useAuthStore()
const { venues, selectedVenue } = useVenueStore()
const { raws, selectedRAW } = useRAWStore()
```

### Database (9 Tables Ready)

- users
- venues
- raw_submissions
- raw_hazards
- venue_hazards
- issues
- attachments
- notifications
- audit_logs

---

## 💡 Quick Code Examples

### Example 1: Sign Up Form
```typescript
import { authService } from '@/lib/services/authService'

const handleSignUp = async (email, password, fullName, role) => {
  try {
    await authService.signUp(email, password, fullName, role)
    navigate('/login')
  } catch (error) {
    alert('Sign up failed: ' + error.message)
  }
}
```

### Example 2: Venue Search
```typescript
import { venueService } from '@/lib/services/venueService'
import { useVenueStore } from '@/lib/stores/venueStore'

const handleSearch = async (query) => {
  const venues = await venueService.searchVenues(query)
  useVenueStore.setState({ venues })
}
```

### Example 3: Create RAW
```typescript
import { rawService } from '@/lib/services/rawService'

const handleCreateRAW = async (userId, venueId) => {
  // Create RAW
  const raw = await rawService.createRAW({
    user_id: userId,
    venue_id: venueId,
    status: 'draft',
    hazards: []
  })
  
  // Add hazard
  await rawService.addHazardToRAW({
    raw_id: raw.id,
    hazard_description: 'Slip hazard',
    severity: 'high',
    likelihood: 'medium',
    control_measures: 'Regular inspection'
  })
  
  return raw
}
```

---

## 🚀 Start Building!

### Option 1: Follow the Quick Start (5 minutes)
```bash
# 1. Read QUICK_START.md
# 2. Create Supabase project
# 3. Update .env
# 4. Run database schema
# 5. pnpm dev
```

### Option 2: Full Setup Guide (15 minutes)
```bash
# Read SUPABASE_SETUP.md step by step
# Covers all configuration options
# Includes troubleshooting
```

### Option 3: Jump Right In (Experience Required)
```bash
# Already familiar with Supabase?
# 1. Update .env with credentials
# 2. Run apps/web/lib/database-schema.sql
# 3. pnpm dev
# 4. Use services from lib/services/
```

---

## 📞 Need Help?

### 1. Check Documentation
- **Error in Supabase setup?** → See SUPABASE_SETUP.md
- **Need code examples?** → See INTEGRATION_CHECKLIST.md
- **Want to understand architecture?** → See IMPLEMENTATION_SUMMARY.md
- **Want quick answers?** → See QUICK_START.md

### 2. Browse Code
- Services: `apps/web/lib/services/*.ts`
- Stores: `apps/web/lib/stores/*.ts`
- Database: `apps/web/lib/database-schema.sql`

### 3. Useful Links
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev

---

## ✅ Success Checklist

After setup, verify:

- [ ] Supabase project created
- [ ] `.env` has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Database schema SQL executed successfully
- [ ] 9 tables created in Supabase (check Table Editor)
- [ ] `pnpm dev` starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] No errors in browser console about Supabase

---

## 🎯 Your First Feature to Build

**Build a Login Page** (40 minutes)

1. Create `apps/web/pages/login.tsx`
2. Add email/password form
3. Call `authService.signIn(email, password)`
4. On success, redirect to dashboard
5. On error, show error message

```typescript
import { authService } from '@/lib/services/authService'
import { useAuthStore } from '@/lib/stores/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useAuthStore()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await authService.signIn(email, password)
      const user = await authService.getCurrentUser()
      setUser(user)
      navigate('/dashboard')
    } catch (error) {
      alert('Login failed: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

---

## 🎓 Learning Path

1. **Week 1**: Setup + Authentication Pages
2. **Week 2**: Venue Management + RAW Creation
3. **Week 3**: Approval Workflow + Issue Tracking
4. **Week 4**: Polish + Testing + Deployment

---

## 🚀 Ready to Launch?

Your SafeOps MVP has:
- ✅ Complete backend infrastructure
- ✅ Database schema with 9 tables
- ✅ All CRUD services implemented
- ✅ State management ready
- ✅ Security configured (RLS, Auth)
- ✅ Comprehensive documentation

**All you need to do is build the React pages!**

---

## �� Let's Go!

Start with **QUICK_START.md** and you'll be live in 30 minutes.

Questions? Check the relevant documentation file above.

Happy building! 🚀

---

*Generated: 30 November 2025*
*Project: SafeOps Risk Assessment Worksheet*
*Status: MVP Ready for UI Development*
