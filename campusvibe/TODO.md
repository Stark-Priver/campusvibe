# CampusVibe Custom Auth Migration - TODO

## Status: Plan Approved ✅ Implementation Started

### Phase 1: Dependencies & Schema (Complete these first)
- [x] **Install dependencies**: `npm install bcryptjs jsonwebtoken` ✅
- [x] **Update supabase-schema.sql**: Add custom `users` table... ✅
- [x] **JWT_SECRET**: Add to .env.local + `npm run dev` restart ✅
- [x] **Create `src/lib/auth/custom.ts`**: Custom register/login/JWT ✅
- [x] **Update `src/lib/auth/actions.ts`**: Custom register/login with redirect ✅

- [ ] **Update supabase-schema.sql**: Add custom `users` table (id, email unique, password_hash, full_name, university, roles json/text[], email_verified false default, created_at)
  - Remove/disable Supabase auth trigger `handle_new_user` (conflicts with custom)
  - Run in Supabase SQL Editor
- [ ] **Restart dev server**: `npm run dev`

### Phase 2: Custom Auth Logic
- [ ] **Create `src/lib/auth/custom.ts`**: 
  - registerUser(email, password, fullName, university): bcrypt.hash, insert users (roles: ['student'], verified: true)
  - loginUser(email, password): query, bcrypt.compare, sign JWT {userId, email, roles}
  - verifyToken(token): jwt.verify → user object
  - JWT_SECRET from .env.local
- [ ] **Update `src/lib/auth/actions.ts`**:
  - register: custom registerUser → set session cookie → redirect('/dashboard')
  - login: custom loginUser → set cookie → redirect('/dashboard')

### Phase 3: Middleware & Pages
- [ ] **Update `src/middleware.ts`**: Verify JWT cookie → user → protect routes (dashboard if no user → /login/register, auth pages if user → /dashboard)
- [ ] **Update dashboard pages** (`dashboard/page.tsx`, `[role]/page.tsx`): getCurrentUser from middleware/JWT (no Supabase getUser/profile)
  - Query `users` table by id for profile data

### Phase 4: Testing & Cleanup
- [ ] Test: Register → direct /dashboard (student role), Login → dashboard, Logout → home
- [ ] Remove Supabase auth imports/references (lib/supabase/server.ts still for data)
- [ ] Update TODO.md progress after each step

**Expected Result**: Register succeeds → immediate dashboard (no loop/email), custom SQL users table.

**Current Progress**: Plan created ✅

