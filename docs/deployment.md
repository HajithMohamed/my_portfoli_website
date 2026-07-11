# Deployment

## Netlify Frontend

Use `netlify.toml` at the repository root. The frontend deploy uses:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `.next`
- Required env vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`

Do not deploy the NestJS backend to Netlify.

## Railway Backend

Use `railway.json` at the repository root. Railway should provide:

- `DATABASE_URL`
- `PORT`
- `FRONTEND_URL`
- `NETLIFY_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `GITHUB_TOKEN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

After provisioning PostgreSQL, run Prisma migrations and seed the first admin:

```powershell
npm.cmd run prisma:deploy --workspace backend
npm.cmd run prisma:seed --workspace backend
```

Swagger is available at `/docs`; health is available at `/health`.
