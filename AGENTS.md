# Working on Setu

This is the source for https://setu.anikethkalagara.com, a React/Vinext app with Cloudflare D1 multiplayer rooms.

- Read README.md first. The person you are helping may not have a technical background.
- Use `npm ci`, then `npm run dev`. Development prepares the local database automatically. Local and production databases are separate.
- Before proposing a release, run `npm run check` and `npm run build`. Use `npm run test:local` while the local server is running.
- Preserve anonymous participant/host tokens, hidden answers before reveal, skip controls, unanimous opt-in for sensitive scenarios, and consent before sharing letter lines.
- All three game cards must launch their own mode, and selected modes must reach both solo practice and multiplayer rooms.
- Deployment is through Cloudflare Workers Builds connected to GitHub `main`. Its build command runs checks and the production build; its deploy command applies pending schema migrations and deploys. Pushing to `main` publishes. Respect any user instruction to keep work local or on a branch.
- `wrangler.json` is the Cloudflare configuration. `.openai/hosting.json` records the original Sites identity; do not recreate or publish to that legacy Site to update the custom domain.
- Do not commit credentials, `.env`/`.dev.vars` files, local room databases, or node_modules. Use additive schema migrations in `drizzle/`; never rewrite already-applied migrations.
- Help contributors understand what changed, what was tested, and when a push will affect production.
