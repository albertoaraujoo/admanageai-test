# Architecture

## Main routes

- `/home`: ad gallery and Recreate entry point
- `/products`: product creation/editing/management
- `/projects`: generated history and final viewer
- `/login`: authentication

## Generation flow

1. User opens Recreate from Home
2. User fills product information
3. Client calls Server Action
4. Server calls NanoBanana API
5. Result is stored in Projects (Zustand + persist)

## Global state

`lib/store.ts` centralizes:

- products
- generated projects
- plan status (free/pro)
