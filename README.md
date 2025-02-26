<img src="app/icon.svg" width="48" height="48" alt="Mothership icon" />

# MOTHERSHIP

> Property management, simplified.

A demo tenant management dashboard for landlords - built to continuously explore modern full-stack TypeScript architecture with a focus on clean patterns over complexity. Not intended for production use.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New%20York-black)](https://ui.shadcn.com)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team)
[![SQLite](https://img.shields.io/badge/SQLite-libSQL-003B57?logo=sqlite)](https://turso.tech/libsql)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white)](https://react-hook-form.com)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)](https://zod.dev)
[![Recharts](https://img.shields.io/badge/Recharts-22B5BF)](https://recharts.org)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)

---

## Features

- **Portfolio Dashboard:** KPI stat cards (properties, occupancy, revenue, open requests), occupancy pie chart, 12-month revenue vs. expenses area chart, and a clickable activity feed
- **Property Management:** Grid view with occupancy badges, full CRUD (create, edit, delete) via modal forms with Zod validation
- **Property Detail:** Per-property view with tabbed panels: Units, Financials (revenue / expenses / NOI), and Maintenance history. Inline edit and delete actions.
- **Tenant Directory:** Stat cards (total, active leases, expiring soon, monthly revenue) above a sortable, filterable table. Click any row to open a detail sheet with edit and delete actions.
- **Maintenance Tracker:** Filterable requests table across all properties. Click any row to open a detail modal with status transitions, notes, and delete.
- **Global Search:** `⌘K` to search across properties, tenants, and maintenance requests with keyboard navigation
- **Settings:** Vertical sidebar nav with Profile, Account, Preferences (timezone, date format, currency), and Notification toggles. Persisted to localStorage.
- **Dark Mode:** System-aware, togglable via sidebar, no flash on load

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0

### Setup

```bash
git clone https://github.com/yourusername/mothership.git
cd mothership
bun install
bun run db:migrate   # create SQLite tables
bun run db:seed      # populate with demo data
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
bun run test         # run all 170 unit tests (Vitest + jsdom)
bun run test:watch   # run tests in watch mode
bun run test:ui      # open Vitest UI in browser
bun run type-check   # TypeScript strict check
bun run build        # production build
bun run db:studio    # open Drizzle Studio (visual DB browser)
```

---

## Architecture

### Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | RSC-first: server components fetch data directly, no API boilerplate |
| Database | SQLite via `@libsql/client` | Zero infra locally, drop-in path to Turso for production |
| ORM | Drizzle ORM | Schema-as-types, composable queries |
| UI | shadcn/ui + Radix UI | Owned components, accessible by default |
| Styling | Tailwind CSS v4 | Constraint-based design system, no CSS files to maintain |
| Forms | React Hook Form + Zod | Uncontrolled performance + schema-first validation |
| Charts | Recharts | Composable SVG, tree-shakeable |
| Testing | Vitest + Testing Library | Jest-compatible API, Vite-native speed |

### Data flow

```
Page (async Server Component)
  → query function in db/queries/
  → Drizzle ORM → SQLite
  → typed data passed as props to components

Client Component (form, sortable table)
  → user interaction
  → Server Action in actions/
  → Drizzle mutation → SQLite
  → revalidatePath() → Next.js re-renders the page
```

No API routes. No client-side data fetching library. The entire read/write cycle is type-safe end to end.

### Server vs. Client Components

The rule is simple: a component is a Client Component only when it needs state, event handlers, or browser-only APIs (like the Recharts canvas). Everything else is a Server Component, which keeps the client JS bundle minimal.

**Client components:** `AppSidebar`, `GlobalSearch`, `ThemeToggle`, `OccupancyChart`, `QuickActions`, `RevenueChart`, `PropertyForm`, `AddPropertyModal`, `PropertyDetailActions`, `TenantsTable`, `TenantForm`, `AddTenantModal`, `EditTenantModal`, `TenantDetailSheet`, `RequestsTable`, `MaintenanceForm`, `AddMaintenanceModal`, `MaintenanceRequestModal`, `Pagination`

**Everything else:** Server Component - rendered on the server with fresh data.

### Project structure

```
mothership/
├── app/
│   ├── layout.tsx              # Root: ThemeProvider, fonts, metadata
│   ├── not-found.tsx           # Custom 404
│   └── (dashboard)/            # Route group: shared sidebar layout
│       ├── layout.tsx          # AppShell with collapsible sidebar
│       ├── loading.tsx         # Skeleton loading state
│       ├── page.tsx            # / - Dashboard
│       ├── properties/         # /properties and /properties/[id]
│       ├── tenants/            # /tenants
│       ├── maintenance/        # /maintenance
│       └── settings/           # /settings
├── actions/                    # Server Actions (create, update, delete, search)
├── components/
│   ├── ui/                     # shadcn/ui primitives (auto-generated, untouched)
│   ├── layout/                 # AppSidebar, GlobalSearch, ThemeToggle
│   ├── dashboard/              # StatCard, RevenueChart, OccupancyChart, ActivityFeed, QuickActions
│   ├── properties/             # PropertyCard, PropertyForm, AddPropertyModal, OccupancyBadge
│   ├── property-detail/        # PropertyDetailActions, PropertyFinancials, PropertyMaintenance, UnitsList
│   ├── tenants/                # TenantsTable, TenantForm, TenantDetailSheet, AddTenantModal, EditTenantModal
│   ├── maintenance/            # RequestsTable, MaintenanceForm, MaintenanceRequestModal, PriorityBadge, StatusBadge
│   └── shared/                 # Pagination
├── db/
│   ├── schema.ts               # Drizzle schema: single source of truth for all types
│   ├── index.ts                # DB client singleton
│   ├── seed.ts                 # Demo data seed script
│   └── queries/                # Read-only query functions (dashboard, properties, tenants, maintenance, units)
├── lib/                        # Pure utilities: formatters, Zod schemas, constants
└── __tests__/                  # Mirrors component structure
    ├── components/
    │   ├── dashboard/
    │   ├── properties/
    │   ├── property-detail/
    │   ├── tenants/
    │   ├── maintenance/
    │   ├── layout/
    │   └── shared/
    └── lib/
```

### Design decisions worth noting

**Money in cents.** All monetary values (`monthlyRent`, `monthlyRevenue`, `securityDeposit`) are stored as integer cents. This eliminates floating-point arithmetic errors (`0.1 + 0.2 !== 0.3`). A `formatCurrency(cents)` function handles display. This is the same pattern used by Stripe.

**Computed `leaseStatus`.** Rather than storing a `leaseStatus` enum that would go stale, the status is derived at query time from `leaseEnd` via `computeLeaseStatus()`. Eliminates an entire class of data consistency bugs.

**`z.number()` + `valueAsNumber` over `z.coerce`.** Zod v4's `z.coerce.number()` resolves the input type to `unknown`, which conflicts with React Hook Form's resolver types. Using `z.number()` with `valueAsNumber` on number inputs keeps types clean end-to-end without any workarounds.

**shadcn/ui components are never modified.** Extension happens through wrapper components (`AddPropertyModal` wraps a `Dialog` wrapping a `PropertyForm`). This survives future `bunx shadcn add` updates without merge conflicts.

---

## Upgrading to Production

Mothership uses SQLite locally via `@libsql/client`. To deploy with a persistent cloud database, swap to [Turso](https://turso.tech) - it's libSQL-compatible with zero code changes:

1. Create a Turso database and get your URL + auth token
2. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in your Vercel environment variables
3. Done - the same Drizzle queries run against Turso

---

## Roadmap

- [ ] Stripe integration for rent collection and payment tracking
- [ ] Lease PDF generation via `@react-pdf/renderer`
- [ ] Email notifications via Resend (lease renewals, overdue rent)
- [ ] Optimistic UI for Server Action mutations
- [ ] Vercel Analytics integration
