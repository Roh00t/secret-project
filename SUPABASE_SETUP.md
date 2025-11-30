# SafeOps Supabase Integration Guide

This guide walks you through setting up Supabase for the SafeOps Risk Assessment Worksheet application.

## What's Been Created

### Backend Infrastructure
- **Authentication Service** (`lib/services/authService.ts`) — Email/password auth, profile management
- **Venue Service** (`lib/services/venueService.ts`) — CRUD operations for venues and hazards
- **RAW Service** (`lib/services/rawService.ts`) — Risk Assessment Worksheet management
- **Zustand Stores** — State management for auth, venues, and RAWs
- **Database Schema** (`lib/database-schema.sql`) — Complete schema with 9 tables, enums, RLS policies

### Features Enabled
✅ User authentication with role-based access (Safety Officer, Facility Manager, OIC/Approver, Admin)
✅ Venue management - browse, search, and add venues in Singapore
✅ RAW creation and submission workflow
✅ Hazard tracking with auto-calculated RPN (Risk Priority Number)
✅ Issue management and approvals
✅ Real-time data persistence
✅ Row-Level Security (RLS) for data privacy

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details:
   - **Project name**: `SafeOps`
   - **Database password**: Choose a strong password (save this!)
   - **Region**: Select `Singapore` (or closest to your location)
5. Wait for the project to be created (2-3 minutes)

### 2. Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** (public key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Update Environment Variables

Replace the placeholders in `.env` with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy all SQL from `apps/web/lib/database-schema.sql`
4. Paste into the SQL editor
5. Click "Run"

This will create all 9 tables with proper relationships, enums, indexes, and RLS policies.

### 5. Enable Realtime (Optional)

For real-time updates on venues and RAWs:

1. Go to **Realtime** in Supabase dashboard
2. Under "Replication", enable tables: `venues`, `raw_submissions`, `issues`, `notifications`

### 6. Install Dependencies

```bash
cd apps/web
pnpm install
```

### 7. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## User Flows

### Creating a User Account

```
1. Sign up with email/password
2. Select role (Safety Officer, Facility Manager, OIC/Approver, Admin)
3. Profile created in `public.users` table
4. Zustand store updates with user data
```

### Creating a RAW

```
1. Click "+" button on dashboard
2. Search and select a venue (or add custom venue)
3. Fill 4-step form:
   - Activity description
   - Select hazards from suggestions
   - Add custom hazards with severity/likelihood
   - Review risk summary (auto-calculated RPN)
4. Submit for approval
5. Notification sent to approvers
6. RAW stored in `raw_submissions` with hazards in `raw_hazards`
```

### Viewing RAWs

```
1. Click any RAW card to open detail view
2. See all hazards, RPN scores, and approval status
3. For approvers: Review and Approve/Reject with comments
4. Changes update in real-time
```

## Key Files & Functions

### Authentication
- `authService.signUp(email, password, fullName, role)`
- `authService.signIn(email, password)`
- `authService.getCurrentUser()`
- `authService.onAuthStateChange(callback)`

### Venues
- `venueService.getAllVenues()`
- `venueService.searchVenues(query)`
- `venueService.createVenue(venueData)`
- `venueService.getVenueHazards(venueId)`

### RAWs
- `rawService.getAllRAWs(userId?)`
- `rawService.createRAW(rawData)`
- `rawService.submitRAW(rawId, userId)`
- `rawService.approveRAW(rawId, approverId)`
- `rawService.addHazardToRAW(hazardData)`

## Data Model

### Users
- `id`, `auth_id` (Supabase auth), `email`, `full_name`, `role`, `phone`, `profile_picture_url`

### Venues
- `id`, `name`, `address`, `postal_code`, `latitude`, `longitude`, `type`, `status`, `critical_issues_count`, `last_raw_date`

### RAW Submissions
- `id`, `user_id`, `venue_id`, `status` (draft/submitted/approved/rejected), `risk_level`, `activity_description`, `submitted_at`, `approved_at`

### RAW Hazards
- `id`, `raw_id`, `hazard_description`, `severity` (low/medium/high/critical), `likelihood` (low/medium/high/very_high), `rpn` (auto-calculated)

### Issues
- `id`, `venue_id`, `title`, `description`, `status` (open/resolved/pending), `severity`, `assigned_to`, `created_by`

### Notifications
- `id`, `user_id`, `title`, `message`, `type`, `related_id`, `is_read`

## Row-Level Security (RLS) Policies

### Users see their own profiles
```sql
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);
```

### All users can view all venues
```sql
CREATE POLICY "Users can view all venues" ON venues
  FOR SELECT USING (true);
```

### Users can only see their own RAWs (and approved RAWs)
```sql
CREATE POLICY "Users can view own RAWs" ON raw_submissions
  FOR SELECT USING (user_id = auth.uid() OR status = 'approved');
```

This ensures users can only access their own data and shared information.

## Troubleshooting

### "Missing Supabase URL or Anon Key"
- Check `.env` file has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after updating `.env`

### "Permission denied for schema public"
- Ensure all SQL was executed successfully
- Check RLS policies are created
- Go to Supabase **Authentication** → **Policies** to verify

### "User already exists"
- Clear browser cookies or use incognito mode
- Or use different email for signup

### Data not persisting
- Check network tab in DevTools for errors
- Verify RLS policies allow the operation
- Check user is authenticated with `auth.uid()`

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Create database schema
3. ✅ Configure environment variables
4. Create authentication UI pages
5. Add venue search and detail pages
6. Build RAW form with hazard selection
7. Implement approval workflow UI
8. Add real-time notifications
9. Deploy to production

## Environment Variables Checklist

```
☑ NEXT_PUBLIC_SUPABASE_URL
☑ NEXT_PUBLIC_SUPABASE_ANON_KEY
☑ DATABASE_URL (if using local PostgreSQL for API)
☑ JWT_SECRET (if using local API)
```

## Support

For issues:
1. Check Supabase logs: Dashboard → Logs → Recent Logs
2. Check browser console for errors
3. Verify RLS policies: Database → Policies
4. Check auth status: User profile in Supabase Auth tab

---

**Last Updated**: November 30, 2025
**Status**: Ready for development
