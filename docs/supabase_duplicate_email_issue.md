# Supabase Duplicate Email Issue

## Summary
Supabase is currently allowing the creation of two separate accounts with the same email address: one via Google OAuth and another via the registration form (email/password). This is not the expected default behavior.

## Steps to Reproduce
1. Register a new user via Google OAuth with email `user@example.com`.
2. Register a new user via the registration form with the same email `user@example.com`.
3. Both registrations succeed and return 201 Created.

## Expected Behavior
- Supabase should prevent the creation of a second account with the same email, regardless of the provider.
- The `/register` endpoint should return an error (e.g., 400 or 409) if the email is already registered.

## Actual Behavior
- Both registration attempts succeed, and two accounts with the same email are created.

## Debugging Notes
- Checked Supabase `auth.users` table: [TODO: Insert findings here]
- Backend registration logic returns 201 even when duplicate email is used.
- Supabase project settings: [TODO: Insert findings here]
- Supabase docs and community recommend that duplicate emails should not be allowed by default.

## Next Steps
- Investigate Supabase Auth settings and constraints.
- Test direct API calls to Supabase Auth to isolate the issue.
- Ensure backend properly propagates Supabase errors.
- Report to Supabase support if this is a bug.

---
*Documented on: {{DATE}}* 