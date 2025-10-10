## Objectives

- Extend the vendors workspace with a “census queue” so procurement can request vendors that are missing from the catalog.
- Keep the existing dashboard layout intact while introducing low-friction entry points for the new workflow.
- Model the full flow end to end—typed forms, data normalization, Convex persistence, and admin resolution—so the feature feels production ready.

## Implementation highlights

- **Multi-step intake form** (TanStack Form + ArkType) validates vendor identity, location, contacts, and justification before submission.
- **Convex mutations/queries** handle request creation, filtering, and admin decisions while normalizing optional fields to prevent data pollution.
- **Domain-focused seeding** ships with buyer/admin personas and realistic vendor data so the experience works out of the box and mirrors real usage.
- **Reusable dashboard primitives** (tables, empty states, sidebar, stepped form) keep the UI consistent and make it easy to extend follow-up features.

## Profile switching

The sidebar toggle simply swaps between the seeded buyer/admin personas stored in Zustand. It is intentionally lightweight—there is no authentication layer or authorization logic implied. The switch exists purely for demo purposes so you can preview both sides of the workflow without managing accounts.

## Interaction notes

The “Request vendor” button at the top-right of the vendors view is intentionally high-visibility to support a quick walkthrough. In a production setting the entry point would likely live in the empty state (as already shown) or inside a secondary menu, since the primary dashboard focus remains catalog browsing rather than vendor intake.

## Local development

The repository is wired to a hosted Convex deployment for convenience. With Bun v1.1 or newer:

```bash
# 1. Install dependencies
bun install

# 2. Copy the example environment file (already points to the hosted Convex instance)
cp .env.example .env.local

# 3. Start the Next.js dev server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the census queue flow. The sidebar profile toggle lets you move between the buyer intake and admin review experiences.

## Optional: run Convex locally

If you prefer to spin up Convex on your machine instead of relying on the hosted deployment:

```bash
# Install the Convex CLI if you don't already have it
bunx convex --help

# Start the local Convex dev server (runs on http://localhost:3188)
bunx convex dev

# In another terminal, seed the local database
bunx convex run seed
```

Then update `.env.local` so `NEXT_PUBLIC_CONVEX_URL` points to the URL printed by `convex dev` (usually `http://127.0.0.1:3188`). Restart `bun dev` afterwards.
