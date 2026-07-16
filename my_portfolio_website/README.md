# Hz Labs Portfolio Platform

Premium portfolio CMS, GitHub intelligence platform, and digital product studio website for Mohamed Hajith.

## Apps

- `frontend/`: Next.js App Router public portfolio and admin CMS UI.
- `backend/`: NestJS REST API, Prisma schema, auth, CMS modules, GitHub sync, Cloudinary upload wrapper, Swagger docs.
- `docs/`: Architecture, deployment, and Figma implementation notes.

## Local Setup

```powershell
npm.cmd install
npm.cmd run prisma:generate
```

Create local env files from `.env.example`, `frontend/.env.local.example`, and `backend/.env.example`.

Start apps in separate terminals:

```powershell
npm.cmd run dev:backend
npm.cmd run dev:frontend
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:4000`

Swagger: `http://localhost:4000/docs`

## Quality Gates

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

## GitHub Remote

The target remote is:

```text
https://github.com/HajithMohamed/my_portfoli_website.git
```

Initialize locally when ready:

```powershell
git init
git remote add origin https://github.com/HajithMohamed/my_portfoli_website.git
```
