# Farm2Retail

A **frontend-only** agricultural marketplace prototype that connects three user roles — Farmers, Retailers, and Landowners — in a single role-based React application. Users can list and book harvests, manage grow-to-order bids, discover and lease farmland, and explore mock soil intelligence.

> **Project status:** Demonstration prototype. No backend, database, real authentication, payment processing, or persistent marketplace data.

---

## Features

### Farmer
- Create, **edit**, and manage harvest listings with crop details, quantity, price, harvest date, **description, and optional image upload**
- View bookings made on listed harvests by retailers
- Browse retailer crop requirements and submit competitive bids with **proposed price, quantity, harvest date, and message**
- Discover available farmland and submit lease applications with **proposed rent, duration, and message**
- Use **Soil Intelligence** for mock soil classification and crop recommendations based on location
- **Duplicate submission prevention** on all forms with loading states and stale error clearing

### Retailer
- Browse available harvest listings with filtering by category and location
- Book produce quantities from farmers with instant total calculation and **stock validation**
- View and cancel active bookings with **stock restoration** and confirmation dialogs
- Post crop requirements for grow-to-order supply with quality specifications, **target price, location, and required-by date**
- Review farmer bids in a structured table and **accept/reject with processing guards**
- Accepting a bid auto-rejects other pending bids, **creates an order**, and updates requirement status
- Track grow-to-order progress through **4 stages**: Farmer Selected → Growing → Ready for Harvest → Delivered

### Landowner
- Create, **edit**, and manage farmland property listings with acreage, rent, soil type, irrigation, **permitted crops, description, and optional image upload**
- Review and approve or reject farmer lease applications with **processing guards**
- Approving an application auto-rejects other pending applications for the same property, **creates a lease**, and updates property status to **Leased**
- View active and past leases with tenant details, lease terms, **days remaining, and end-early option**
- Ending a lease early makes the property **Available** again

### Shared Marketplace Workflows
1. **Harvest Pre-Booking** — Farmers list upcoming harvests; retailers pre-book quantities before harvest
2. **Grow-to-Order Bidding** — Retailers post requirements; farmers bid; retailers accept bids to create tracked orders
3. **Farmland Leasing** — Landowners list properties; farmers apply; landowners approve to create leases
4. **Soil Intelligence** — Farmers enter location and area to receive simulated soil classification and crop recommendations

### Cross-Cutting Improvements
- **Consistent demo identity constants** (`You (Demo Farmer)`, `You (Demo Retailer)`, `You (Demo Landowner)`) shared across all pages via Outlet context
- **Form submission guards** (`isSubmitting`) prevent duplicate submissions on all forms
- **Stale error clearing** on retry attempts
- **Email normalization** (trim + lowercase) for registration and login
- **Role validation** on init and switch — invalid roles redirect to `/login`

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React | ^19.2.8 | UI framework |
| | React DOM | ^19.2.8 | React renderer |
| Routing | React Router DOM | ^7.18.4 | Client-side routing |
| Styling | Tailwind CSS | ^4.3.3 | Utility-first styling |
| | @tailwindcss/vite | ^4.3.3 | Tailwind Vite plugin |
| Icons | lucide-react | ^1.59.0 | Icon library |
| Build | Vite | ^8.3.0 | Dev server & production bundler |
| | @vitejs/plugin-react | ^6.1.1 | React Fast Refresh |
| Linting | ESLint | ^10.10.0 | Code quality |

**Language:** JavaScript (.jsx files) only — no TypeScript.
**State Management:** React hooks (`useState`, `useOutletContext`) — no Redux, Zustand, or Context API.
**Data:** Plain JavaScript modules in `src/data/` and `src/layouts/DashboardLayout.jsx` — no mock API library.

---

## Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0` (required by Vite 8)
- **npm** (included with Node.js)
- **Git**

Verify installed versions:
```bash
node --version
npm --version
```

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Rizzwan07/Farm2Retail.git
cd Farm2Retail
```

### 2. Install Dependencies
```bash
npm install
```
No environment file or API key is required — all data is defined in JavaScript source files.

### 3. Start the Development Server
```bash
npm run dev
```
Open the URL printed by Vite (typically `http://localhost:5173/`).

### Windows PowerShell Note
If port 5173 is in use:
```powershell
npm run dev -- --port 5174
```

---

## Running the Application

1. Open the home page and select **Browse Marketplace**, **Sign In**, or **Sign Up**
2. **Sign Up**: Enter full name, email, password (≥6 chars), confirm password, select role → creates registered account with salted SHA-256 hash
3. **Sign In**: Enter email and password → registered accounts verify against stored hash; unregistered emails are **rejected**
4. Select a demo role: **Farmer**, **Retailer**, or **Landowner** (if using unregistered email with legacy demo-mode, not applicable for registered accounts)
5. Use the dashboard sidebar to navigate features for that role
6. Use the role selector in the topbar to switch workspaces
7. Select **Sign Out** to clear the demo role and return to the login page

**Demo Notes:**
- Registered accounts verify passwords using salted SHA-256 hashes via Web Crypto API
- Registered account profiles persist in `localStorage` across browser refreshes
- The selected role is stored in `sessionStorage` under `demoRole`
- Dashboard records are held in React memory and reset on page refresh
- Prices and totals are illustrative — no payment gateway exists
- **Form submissions are guarded** against rapid duplicate clicks
- **Validation errors clear automatically** when retrying after a failed submission

---

## How the Application Works

### Login, Sign Up & Role Access
`Login.jsx` validates the form and stores the selected role in `sessionStorage`. If the email belongs to a registered account (stored in `localStorage`), the password is verified against a salted SHA-256 hash. **Unregistered emails are rejected** with "No account found with this email". `SignUp.jsx` creates new demo accounts via `src/utils/auth.js`, hashing passwords with the Web Crypto API before storing them. `DashboardLayout.jsx` checks for a stored role before rendering dashboard routes and redirects to `/login` when missing or invalid.

### Shared Dashboard State
`DashboardLayout.jsx` initializes all marketplace entities with `useState`:
- `harvests`, `bookings`, `requirements`, `bids`, `orders`
- `properties`, `leaseApplications`, `leases`

These values and setters are passed to route pages through React Router's `Outlet` context along with `demoIdentities` for consistent role-based filtering. This enables actions in one role's workspace to appear immediately in another workspace during the same browser session (e.g., a farmer creating a harvest appears in the retailer's browse view instantly).

### Soil Intelligence
`src/utils/soilAnalysis.js` is a mock adapter that:
1. Maps Indian regions to hardcoded soil types (Black Cotton, Alluvial, Red Loam, Laterite, Sandy Loam, Clay, Peaty)
2. Returns crop recommendations with suitability scores per soil type
3. Adds area-based insights (small/medium/large holdings)
4. Simulates a 1.5–2.5 second analysis delay
5. **Does not** call an AI model, laboratory service, or external API

### Design Tokens
Defined in `src/index.css` under `@theme`:
```css
--color-green-primary: #2D5A27;   /* Forest green */
--color-green-dark:   #1A3A18;    /* Dark green */
--color-green-light:  #4A7C44;    /* Light green */
--color-cream:        #FAF8F5;    /* Warm off-white */
--color-earth-brown:  #8B6914;    /* Earthy accent */
--color-earth-light:  #D4A843;    /* Light earth accent */
--font-sans:          "Inter", system-ui, sans-serif;
```

---

## System Architecture

```mermaid
flowchart TD
    Browser[User Browser] --> Public["Home, Login & Sign Up Pages"]
    Public --> Router[React Router v7]
    Router --> Guard{Demo role in\nsessionStorage?}
    Guard -- No --> Login[Redirect to /login]
    Guard -- Yes --> Shell[DashboardLayout]
    Shell --> Sidebar[Sidebar\nRole Navigation]
    Shell --> Topbar[Topbar\nRole Switcher & Sign Out]
    Shell --> Outlet[Outlet\nRoute Page]
    Outlet --> Farmer[Farmer Features]
    Outlet --> Retailer[Retailer Features]
    Outlet --> Landowner[Landowner Features]
    Shell --> State[React useState\nShared Marketplace State]
    State --> SeedData["JavaScript Seed Data\nharvests.js + inline"]
    Public --> LocalStorage["localStorage\nRegistered Accounts (hashed)"]
    Outlet --> Soil["Mock Soil Analysis\nsrc/utils/soilAnalysis.js"]
    State -. browser refresh clears data .-> Reset[Fresh Demo State]
```

**All application processing happens in the browser.** Browser storage used: `sessionStorage` for the active demo role and display name; `localStorage` for registered account profiles (with hashed passwords).

---

## Data Relationships (ER Diagram)

The following describes object relationships in the demo frontend state. **This is not a database schema.**

```mermaid
erDiagram
    USER ||--o{ HARVEST_LISTING : creates
    USER ||--o{ BOOKING : makes
    USER ||--o{ CROP_REQUIREMENT : posts
    USER ||--o{ BID : submits
    USER ||--o{ PROPERTY : lists
    USER ||--o{ LEASE_APPLICATION : submits
    USER ||--o{ LEASE : participates_in
    HARVEST_LISTING ||--o{ BOOKING : receives
    CROP_REQUIREMENT ||--o{ BID : receives
    PROPERTY ||--o{ LEASE_APPLICATION : receives
    LEASE_APPLICATION ||--o| LEASE : becomes
    BID ||--o| ORDER : creates
    CROP_REQUIREMENT ||--o{ ORDER : fulfills
```

---

## Main Routes

| Route | Purpose | Role Access |
|-------|---------|-------------|
| `/` | Public landing page | All |
| `/login` | Demo role selection & sign-in (registered accounts only) | All |
| `/signup` | New account registration | All |
| `/dashboard` | Role-specific dashboard home | All |
| `/dashboard/my-harvests` | Farmer harvest listings (create/edit/delete) | Farmer |
| `/dashboard/browse-harvests` | Retailer harvest search | Retailer |
| `/dashboard/harvest/:id` | Harvest details & booking | Farmer, Retailer |
| `/dashboard/my-bookings` | Farmer view of harvest bookings | Farmer |
| `/dashboard/retailer-bookings` | Retailer booking management | Retailer |
| `/dashboard/crop-requirements` | Retailer crop requirements (create/edit/delete) | Retailer |
| `/dashboard/crop-bids` | Farmer bid submission | Farmer |
| `/dashboard/manage-bids/:id` | Retailer bid management | Retailer |
| `/dashboard/orders` | Grow-to-order tracking | Farmer, Retailer |
| `/dashboard/my-properties` | Landowner property listings (create/edit/delete) | Landowner |
| `/dashboard/find-farmland` | Farmer farmland search | Farmer |
| `/dashboard/property/:id` | Property details & lease application | Farmer, Landowner |
| `/dashboard/lease-applications` | Lease application management | Farmer, Landowner |
| `/dashboard/lease-management` | Active lease overview | Farmer, Landowner |
| `/dashboard/soil-intelligence` | Mock soil analysis | Farmer |

Unimplemented dashboard slugs are handled by `PlaceholderPage.jsx`.

---

## Project Structure

```text
Farm2Retail/
├── public/                         # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                     # Local image assets (optional)
│   ├── components/                 # Reusable UI components
│   │   ├── Sidebar.jsx             # Role-based navigation drawer
│   │   └── Topbar.jsx              # Header with role switcher
│   ├── data/                       # Sample/mock data
│   │   └── harvests.js             # Seed harvest listings + helpers
│   ├── layouts/                    # Page layout shells
│   │   └── DashboardLayout.jsx     # Shared shell + all marketplace state + demoIdentities
│   ├── pages/                      # Route-level components
│   │   ├── HomePage.jsx            # Landing page
│   │   ├── Login.jsx               # Demo sign-in with role selection
│   │   ├── SignUp.jsx              # New account registration
│   │   ├── DashboardHome.jsx       # Dashboard overview
│   │   ├── MyHarvests.jsx          # Farmer: list/manage harvests (with edit)
│   │   ├── BrowseHarvests.jsx      # Retailer: search harvests
│   │   ├── HarvestDetails.jsx      # Harvest view + booking
│   │   ├── MyBookings.jsx          # Farmer: view bookings
│   │   ├── RetailerBookings.jsx    # Retailer: manage bookings
│   │   ├── CropRequirements.jsx    # Retailer: post requirements
│   │   ├── CropBids.jsx            # Farmer: bid on requirements
│   │   ├── ManageBids.jsx          # Retailer: review/accept bids
│   │   ├── Orders.jsx              # Track orders
│   │   ├── MyProperties.jsx        # Landowner: list properties (with edit, image upload)
│   │   ├── FindFarmland.jsx        # Farmer: search farmland
│   │   ├── PropertyDetails.jsx     # Property view + lease apply
│   │   ├── LeaseApplications.jsx   # Landowner: review applications
│   │   ├── LeaseManagement.jsx     # Landowner: view leases
│   │   ├── SoilIntelligence.jsx    # Farmer: soil analysis tool
│   │   └── PlaceholderPage.jsx     # Unimplemented route fallback
│   ├── utils/                      # Helper functions
│   │   ├── auth.js                 # Demo account registration & hashing
│   │   └── soilAnalysis.js         # Mock soil intelligence adapter
│   ├── App.jsx                     # Router configuration
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind import + design tokens
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite + React + Tailwind config
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies & npm scripts
├── AGENTS.md                       # Project development instructions
├── PROJECT_CONTEXT.md              # Verified development state
└── README.md                       # This file
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build in `dist/` |
| `npm run lint` | Run ESLint across .js/.jsx files |
| `npm run preview` | Preview production build locally |

**Before committing:**
```bash
npm run lint
npm run build
```

---

## Customization Ideas

| Area | File | Modification |
|------|------|--------------|
| **Color Theme** | `src/index.css` | Update `@theme` design tokens |
| **Seed Data** | `src/data/harvests.js` | Add/edit harvest listings |
| | `src/layouts/DashboardLayout.jsx` | Modify sample requirements/properties |
| **Soil Logic** | `src/utils/soilAnalysis.js` | Add regions, soil types, crop recommendations |
| **Navigation** | `src/components/Sidebar.jsx` | Add/remove menu items per role |
| **New Pages** | `src/pages/` + `src/App.jsx` | Create component, add Route |
| **UI Components** | `src/components/` | Build reusable components |

---

## Limitations

- **No backend, API, database, server-side session, or real authentication**
- **Browser-side account registration is a frontend-only demo** — registered accounts are stored in `localStorage` with salted SHA-256 password hashes (Web Crypto API). This prevents casual plaintext inspection but **does not provide production-grade security**. Never rely on client-side hashing alone in a real application; always use a server with a proper key-derivation function (bcrypt, scrypt, Argon2).
- All marketplace data (harvests, bookings, requirements, bids, orders, properties, applications, leases) stored only in React memory — **resets on page refresh**
- Registered account profiles persist across refreshes via `localStorage`; marketplace data does not
- Demo role is stored in `sessionStorage` under `demoRole`
- Prices and booking totals are illustrative — **no payment gateway or refund workflow**
- Soil Intelligence uses regional hardcoded mappings and suitability scores — **not a laboratory test or ML model**
- No image upload persistence — images stored as base64 data URLs in React state only (lost on refresh)
- Role checks are UI/navigation only — no server-side authorization. Direct URL access to `/dashboard/*` routes only guarded by `demoRole` existence and validity, not by role-specific permissions.
- No password recovery / reset flow for registered accounts
- No email verification step during registration

---

## License

MIT License