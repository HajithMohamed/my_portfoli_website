<div align="center">

# 🌐 HZ Labs Portfolio Platform & Digital Studio
### *Next-Generation Developer Portfolio, GitHub Intelligence Engine & Headless CMS*

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <a href="https://www.hzlabs.studio/"><strong>Explore Live Platform »</strong></a> ·
  <a href="#-system-architecture"><strong>Architecture</strong></a> ·
  <a href="#-key-features"><strong>Features</strong></a> ·
  <a href="#-quick-start"><strong>Quick Start</strong></a> ·
  <a href="#-rest-api--swagger-docs"><strong>API Docs</strong></a>
</p>

</div>

---

## 📌 Executive Summary

**HZ Labs Portfolio Platform** is an enterprise-grade personal engineering website, live GitHub telemetry dashboard, and headless CMS designed and engineered for **Mohamed Hajith** (Full-Stack Software Developer & BICT Hons Undergraduate at the Faculty of Technology, University of Ruhuna).

Engineered as a clean monorepo architecture, this platform pairs a **Next.js 16 App Router** frontend featuring a cybernetic HUD design system with a hardened **NestJS 11** backend API backed by **PostgreSQL** and **Prisma ORM**.

- **Live Production URL:** [https://www.hzlabs.studio/](https://www.hzlabs.studio/)
- **Target Repository:** [https://github.com/HajithMohamed/my_portfoli_website](https://github.com/HajithMohamed/my_portfoli_website)
- **Interactive Swagger Documentation:** Available at `/docs` on the backend server.

---

## ⚡ Key Features

### 🖥️ 1. Cybernetic HUD & Terminal Aesthetic
- **Visual Excellence:** High-performance dark aesthetic with ambient glow effects, glassmorphic cards, and sleek cybernetic accents (`#2DD4BF` teal, `#38BDF8` sky blue, `#818CF8` indigo).
- **Responsive Animations:** Powered by **Framer Motion**, **GSAP**, and **Lenis** smooth scrolling.
- **Micro-Interactions:** Interactive telemetry badges, hover effects, sound fx toggles, and live system status indicators.

### 👤 2. Authentic BioSection & Profile Matrix
- **Glowing Portrait Frame:** High-resolution portrait photo with glowing cybernetic borders and status pulse badge.
- **Academic Credentials:** Details undergraduate education at Faculty of Technology, University of Ruhuna (2023–2027).
- **Executive Philosophy:** Highlights core software values (*Operational > Decorative • Maintainable > Clever • Secure by Default*).
- **Direct Connect CTAs:** Rapid recruiter actions, instant email trigger, resume preview, and social links.

### 📊 3. Real GitHub 53-Week Contribution Heatmap
- **Authentic Commit Velocity Grid:** Full 53-week × 7-day contribution graph matching GitHub's dark green/teal velocity scale.
- **Multi-Year Switcher:** Seamlessly view total contributions and activity maps across multiple calendar years (2026, 2025, 2024).
- **Live Metric Badges:** Real-time streak tracking, active repositories, code velocity rates, and interactive tooltip inspect for daily contributions.

### 🚀 4. Engineered Case Study & Project Matrix
- **Detailed Architectural Breakdowns:** Case studies for flagship platforms including:
  - **Shoe Bank:** Footwear Business Management System (PHP, MySQL, Tailwind, Docker, OCR-assisted workflows).
  - **Saga Elite:** Collaborative 4-member full-stack e-commerce engine (React, Redux, Node.js, Express, MongoDB, Socket.IO, Playwright CI).
  - **BenchBook:** Medical lab resource reservation system with PostgreSQL reservation conflict integrity constraints and automated Vitest suites.
  - **BloodBridge:** Advanced DBMS academic prototype with procedural PL/pgSQL transaction functions ([PR #7 Merged](https://github.com/akalanka001/-BloodBridge--ADBMS/pull/7)).
  - **HZ Labs Platform:** Digital studio CMS, GitHub sync, and HUD portfolio.
- **Dynamic Filtering:** Filter projects by domain (Full-Stack, Backend, Database, Systems).

### 🕹️ 5. Command Palette (`Ctrl + K` / `Cmd + K`)
- **HUD Command Center:** Instant keyboard-driven navigation modal.
- **Fast Search:** Search projects, skills, certificates, blogs, and external links directly.
- **Quick Actions:** Recruiter mode toggle, CV download, contact form launcher, and theme diagnostics.

### 👔 6. Recruiter Fast-Track Mode
- **Executive Overview:** 60-second summary tailored specifically for technical recruiters, engineering hiring managers, and prospective collaborators.
- **Direct Asset Download:** One-click verified PDF CV retrieval and direct scheduling contacts.

### 🛡️ 7. Hardened Headless CMS & Admin Portal
- **Role-Based Authentication:** Protected administrative portal using **Argon2** password hashing and **JWT** access tokens with refresh token rotation.
- **Modular CMS Endpoints:** Complete CRUD control over projects, skills, certifications, client case studies, blog articles, and contact inquiries.
- **Secure Media Pipeline:** Backend-wrapped **Cloudinary** uploads ensuring API secrets remain server-side.
- **GitHub Sync Engine:** Automated and on-demand synchronization of GitHub repositories, commit telemetry, and language statistics.

---

## 🏛️ System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer["Frontend Client (Next.js 16)"]
        UI["Public HUD Portfolio UI"]
        AdminUI["Admin CMS Dashboard"]
        BFF["Next.js Route Handlers / BFF Proxy"]
    end

    subgraph ServerLayer["Backend API (NestJS 11)"]
        Gateway["NestJS Core / Helmet / CORS / RateLimiter"]
        AuthModule["Auth Module (JWT & Argon2)"]
        CMSModules["CMS Modules (Projects, Skills, Blogs, Certs)"]
        TelemetryModule["GitHub Telemetry & Sync Engine"]
        MediaModule["Uploads & Media Service"]
        PrismaService["Prisma ORM Client"]
    end

    subgraph DataLayer["Storage & External Infrastructure"]
        Postgres[(PostgreSQL Database)]
        Cloudinary["Cloudinary CDN"]
        GitHubAPI["GitHub GraphQL & REST APIs"]
    end

    UI --> BFF
    AdminUI --> BFF
    BFF --> Gateway
    Gateway --> AuthModule
    Gateway --> CMSModules
    Gateway --> TelemetryModule
    Gateway --> MediaModule
    CMSModules --> PrismaService
    AuthModule --> PrismaService
    TelemetryModule --> PrismaService
    PrismaService --> Postgres
    MediaModule --> Cloudinary
    TelemetryModule --> GitHubAPI
```

---

## 🧰 Technology Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16** (App Router), **React 19**, **TypeScript 5** |
| **Styling & Design** | **Tailwind CSS 4**, Radix UI Primitives, Lucide Icons, Glassmorphism HUD |
| **Animation & Motion** | **Framer Motion 12**, **GSAP 3**, **Lenis** Smooth Scroll |
| **Client Data Fetching** | **TanStack React Query 5**, React Hook Form 7, Zod 4 |
| **Backend Framework** | **NestJS 11**, Express, TypeScript, Node.js 22+ |
| **Security & Auth** | **Argon2**, `@nestjs/jwt`, Passport, Helmet, Cookie-Parser, Throttler |
| **Database & ORM** | **PostgreSQL 16**, **Prisma ORM 6** |
| **Storage & Integrations** | **Cloudinary SDK**, GitHub REST & GraphQL APIs |
| **Documentation** | **Swagger / OpenAPI 3.0** (`@nestjs/swagger`) |
| **Testing** | **Vitest 3**, React Testing Library, **Playwright 1.55**, Jest |
| **DevOps & Hosting** | **Vercel** (Frontend), **Render** (Backend), **Docker**, GitHub Actions |

---

## 📁 Repository Structure

```text
my-portfolio/
├── package.json                         # Monorepo root configuration (NPM Workspaces)
├── render.yaml                          # Render deployment blueprint for Backend
├── docs/                                # System architecture, deployment & guides
│   ├── architecture.md                  # System architecture design notes
│   ├── deployment.md                    # Production deployment workflows
│   └── figma.md                         # UI/UX design references
│
└── my_portfolio_website/
    ├── package.json                     # Core workspace root config
    │
    ├── frontend/                        # Next.js 16 App Router Frontend
    │   ├── src/
    │   │   ├── app/                     # Next.js routes (/, /about, /projects, /blog, /admin, etc.)
    │   │   ├── components/
    │   │   │   ├── sections/            # BioSection, GitHubTelemetry, ProjectsShowcase, etc.
    │   │   │   ├── command/             # HUD Command Palette (Ctrl+K)
    │   │   │   ├── hud/                 # Audio toggles, status pills, and telemetry HUD
    │   │   │   ├── admin/               # Protected CMS control panels
    │   │   │   └── ui/                  # Reusable button, modal, card, badge components
    │   │   └── lib/                     # API client, proxy utilities, and identity tokens
    │   ├── public/                      # Static assets, brand logos, user portraits
    │   └── vitest.config.ts             # Vitest test configuration
    │
    └── backend/                         # NestJS 11 REST API & CMS
        ├── src/
        │   ├── auth/                    # JWT authentication & Argon2 password verification
        │   ├── profile/                 # Developer bio, status, and profile information
        │   ├── skills/                  # Categorized skills matrix
        │   ├── projects/                # Projects, case studies, and architecture writeups
        │   ├── github/                  # Real-time GitHub GraphQL & telemetry engine
        │   ├── blogs/                   # Engineering articles and tutorials
        │   ├── certificates/            # Certifications and credentials
        │   ├── messages/                # Contact form submissions and inquiries
        │   ├── uploads/                 # Cloudinary image and resume upload wrapper
        │   └── prisma/                  # Prisma service and database bindings
        ├── prisma/
        │   ├── schema.prisma            # Relational database schema
        │   ├── seed.ts                  # Development and production database seeder
        │   └── migrations/              # PostgreSQL migration history
        └── test/                        # End-to-end API test suites
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js:** `>= 22.0.0`
- **npm:** `>= 11.0.0`
- **PostgreSQL:** Local PostgreSQL instance or a free cloud database (e.g. Supabase, Neon).

### 2. Installation
Clone the repository and install workspace dependencies:

```powershell
# Clone the repository
git clone https://github.com/HajithMohamed/my_portfoli_website.git
cd my_portfoli_website

# Install all monorepo dependencies
npm install
```

### 3. Environment Configuration
Create environment files from the provided templates:

```powershell
# Root / Backend environment
copy my_portfolio_website\.env.example my_portfolio_website\backend\.env

# Frontend environment
copy my_portfolio_website\frontend\.env.local.example my_portfolio_website\frontend\.env.local
```

Key environment variables:
```dotenv
# Backend (.env)
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db?schema=public
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
GITHUB_USERNAME=HajithMohamed
GITHUB_TOKEN=your_github_personal_access_token_optional
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend (.env.local)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Database Initialization & Seeding

```powershell
# Generate Prisma Client
npm run prisma:generate

# Run migrations against your PostgreSQL instance
npm run prisma:migrate

# Seed default profile data, projects, skills, and admin account
npm run prisma:seed
```

### 5. Running Development Servers

Start frontend and backend concurrently or independently:

```powershell
# Start both apps concurrently
npm run dev

# Or start in separate terminal windows:
npm run dev:backend   # NestJS API running on http://localhost:4000
npm run dev:frontend  # Next.js UI running on http://localhost:3000
```

| Service | Local Address | Description |
| :--- | :--- | :--- |
| **Frontend UI** | `http://localhost:3000` | Main website, portfolio, and recruiter HUD |
| **Admin CMS** | `http://localhost:3000/admin` | Protected content management interface |
| **Backend REST API**| `http://localhost:4000` | NestJS API endpoints |
| **Swagger OpenAPI** | `http://localhost:4000/docs` | Interactive API documentation & sandbox |

---

## 📡 REST API & Swagger Docs

The backend automatically generates interactive OpenAPI documentation. When the backend is running, navigate to `http://localhost:4000/docs` to test all endpoints.

```text
├── /auth
│   ├── POST   /auth/login               # Administrator credentials login (returns JWT)
│   ├── POST   /auth/refresh             # Rotate access token via refresh token
│   └── POST   /auth/logout              # Revoke active session tokens
├── /profile
│   ├── GET    /profile                  # Retrieve public bio, credentials & status
│   └── PATCH  /admin/profile            # [Admin] Update bio and contact details
├── /skills
│   ├── GET    /skills                   # Retrieve categorized skills matrix
│   └── POST   /admin/skills             # [Admin] Add/update skill entries
├── /projects
│   ├── GET    /projects                 # Fetch all published engineering case studies
│   ├── GET    /projects/:slug           # Retrieve detailed case study by slug
│   └── POST   /admin/projects           # [Admin] Create or modify projects
├── /github
│   ├── GET    /github/summary           # GitHub repository count, stars, and telemetry
│   ├── GET    /github/contributions     # 53-week commit velocity calendar data
│   └── POST   /admin/github/sync        # [Admin] Trigger manual GitHub sync
├── /messages
│   ├── POST   /messages                 # Submit contact form inquiry
│   └── GET    /admin/messages           # [Admin] Review and manage incoming inquiries
└── /admin/uploads
    └── POST   /admin/uploads            # [Admin] Upload media/CV to Cloudinary
```

---

## 🧪 Testing & Quality Assurance

This codebase enforces strict quality checks across both frontend and backend workspaces:

```powershell
# 1. Static code analysis and linting
npm run lint

# 2. Strict TypeScript typechecking
npm run typecheck

# 3. Unit and integration tests (Vitest + Jest)
npm run test

# 4. End-to-end browser automation tests (Playwright)
npm run test:e2e

# 5. Production build validation
npm run build
```

---

## 🌐 Production Deployment

- **Frontend (Vercel):**
  - Connected to the `main` branch.
  - Automatically builds Next.js with optimized image caching and static generation.
- **Backend (Render):**
  - Configured using `render.yaml` infrastructure-as-code blueprint.
  - Production start command: `node dist/main.js`.
- **Database (Supabase / PostgreSQL):**
  - Managed PostgreSQL instance with automated backups and connection pooling.

---

## 👨‍💻 Author & Contact

**Mohamed Hajith**  
*Full-Stack Software Developer & BICT (Hons) Undergraduate*  
Faculty of Technology, University of Ruhuna, Sri Lanka (2023–2027)

- **Portfolio:** [https://www.hzlabs.studio/](https://www.hzlabs.studio/)
- **GitHub:** [@HajithMohamed](https://github.com/HajithMohamed)
- **LinkedIn:** [mohamed-hajith-b53559295](https://linkedin.com/in/mohamed-hajith-b53559295/)
- **Email:** [ahammedlebbehajith@gmail.com](mailto:ahammedlebbehajith@gmail.com)

---

<div align="center">
  <sub>Designed & Developed with precision by <strong>Mohamed Hajith</strong> · © 2026 HZ Labs. All rights reserved.</sub>
</div>
