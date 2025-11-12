# Social Feed (React)

## Run
1. `npm install`
2. `npm run dev`
3. Open http://localhost:5173/

Login credentials (mocked):
- username: testuser@logicwind.com
- password: Test123!

## Architecture
- React 19 with Context API for global state (`AuthContext`, `PostContext`)
- Material UI (MUI) for UI components and layout
- React Router for navigation
- `services/api.js` wraps JSONPlaceholder and attaches token header
- Comments are lazy-loaded per post and cached in `PostContext.commentsCache`
- Moderation states kept locally and persisted partially in localStorage (approved counts)

## Features implemented
- Posts feed, search (debounced) and sorting (latest, alpha, most commented)
- Infinite scroll pagination for smoother UX
- Lazy-loaded comments per post (fetched only when needed)
- Add/Edit/Delete posts and comments (optimistic updates with rollback)
- Comment moderation (approve/reject) with approved count persisted locally
- Mock authentication using localStorage token for route protection

## Caching & Persistence
- Post and comment data are cached in memory (`PostContext`) to reduce unnecessary re-fetches
- Approved comment counts are stored in localStorage under the key `approved_counts_v1`.
- Optimistic updates keep the UI responsive even when fake API calls are pending
- JSONPlaceholder is used for data; create/update/delete are faked — the app manages local state as source-of-truth for optimistic behavior.

## Trade-offs & Notes
- JSONPlaceholder doesn't support real pagination or comment moderation; we fetch all posts then locally paginate/filter/search.
- Because there’s no real backend, authentication and moderation are mocked entirely in the frontend.
- Error handling and loading state are minimal — only enough to simulate real-world interactions.
- For production you'd use server-side pagination, endpoints for approve/reject and robust error handling.

## Improvements if more time
- Add JWT-based mock authentication — simulate token generation, expiration, and auto-logout flow using jsonwebtoken and setTimeout for expiry logic.
- Refactor file structure and Improve coding style & consistency
- Enhance optimistic updates — show inline toasts, add retry buttons, and highlight pending items visually.
- Improve responsive design — optimize for mobile and tablet using MUI’s grid breakpoints.
- More robust error UI and toasts for optimistic operations
- Use React Query or SWR for caching, refetching, and better state synchronization with mock APIs.