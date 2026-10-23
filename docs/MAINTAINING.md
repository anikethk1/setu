# Maintaining Setu hosting and data

The beginner workflow is in the root README. This page is for the person maintaining Cloudflare or working with an AI assistant on backend changes.

## Deployment ownership

- GitHub repository: `anikethk1/setu`; production branch: `main`.
- Cloudflare account: `e2230f8a9895031d4d99d79403b125c6`.
- Worker: `setu`.
- Production domain: `setu.anikethkalagara.com`.
- D1 binding: `DB`; database: `setu-production`.
- Production D1 ID: `158140c4-513f-411e-ae0f-55b3f44dd60b`.
- Source configuration: `wrangler.json`; generated deploy configuration: `dist/server/wrangler.json`.

These IDs identify resources; they are not authentication secrets. Normal local development uses an isolated emulated D1 database in `.wrangler/state`, even though the configuration also names production resources. `--local` is explicit in the development migration script. Production migrations require Cloudflare authentication and explicit `npm run deploy`.

The original app was hosted via Sites. `.openai/hosting.json` retains that old project's identity for reference. Normal GitHub releases use the Worker above, not the old Sites publishing tools. The original Sites URL remains a fallback; its database is independent of this Worker's database. Before the hosting handoff, the old database was checked and had no unexpired rooms.

## Cloudflare Workers Builds settings

- Repository: `anikethk1/setu`.
- Production branch: `main`.
- Root directory: repository root.
- Build command: `npm run check && npm run build`.
- Deploy command: `npm run deploy`.
- Node: 24, declared in `.nvmrc`.
- Preview/non-production branch builds: disabled until a separate preview database is configured.

The build must succeed before deployment. `deploy.mjs` applies pending D1 migrations to the named database, then publishes the generated Worker and assets. It stops immediately if either step fails. Keep the generated config rather than deploying the TypeScript Worker entrypoint without the Vite/Vinext build.

The GitHub Actions workflow also checks and builds pushes and pull requests. It has read-only repository permissions and no Cloudflare secrets. Cloudflare's Git integration handles deployment authentication in Cloudflare, outside this repository.

## Local workflow

```
npm ci
npm run dev
```

`dev.mjs` runs `db-local.mjs` before starting Vinext. The migration command uses Wrangler's migration ledger, so repeat startup does not replay applied SQL. `npm run db:local` prepares the local database without starting the app. `npm run check`, `npm run test:local`, and `npm run build` are local operations; none deploys.

## Schema changes

1. Edit `db/schema.ts`.
2. Run `npm run db:generate` to append a migration and Drizzle metadata.
3. Inspect the generated SQL. Keep migrations schema-only and additive where possible. Never rewrite a migration already applied in production.
4. Restart `npm run dev` to apply pending migrations locally; test existing and new flows.
5. Commit the schema, new migration, and metadata together.
6. The next successful `main` deployment applies pending production migrations before uploading the app.

Avoid destructive migrations as a routine release. A failed deployment may still have applied a migration, so rolling back Worker code does not necessarily roll back database schema. D1 Time Travel is available in Cloudflare for recovery; check retention and the recovery point before restoring.

## Production checks and release identity

`npm run test:production` uses ordinary HTTPS validation and never disables certificate checks. It fetches the homepage, an invalid-room error (to check D1), the HTTP redirect, and `/version.json`. The build generates `public/version.json` with the Git commit and build time; it is ignored by Git and copied to the built assets. Compare that commit to the successful Cloudflare build to prove a GitHub change reached the website.

For manual emergency deployment, first authenticate with Cloudflare, then run `npm run check`, `npm run build`, and `npm run deploy`. Routine contributors should use the GitHub workflow instead. Do not store auth tokens in this repository or paste them into chat.
