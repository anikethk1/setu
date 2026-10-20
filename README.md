# Setu

A playable React/Vinext app based on the supplied Setu proposal. Anonymous room-code sessions help students and parents explore each other's perspectives.

## Included

- Real multiplayer rooms backed by Cloudflare D1, with conflict-safe updates and two-second synchronization.
- Host-controlled lobby and session phases; optional participation by the host.
- Student/parent quizzes, career-field personalization, and unanimous opt-in for hypothetical mental health topics.
- Direct launchers for each game, with multiplayer hosting and solo practice. Choose all three or one game; quick sessions use one round per selected game, while full sessions use all its scenarios.
- Guess Who Said It (1 point per correct response), Read the Room / Prediction Markets (2 points), and Beneath the Surface / Scenario Triage (3 points). Tied top responses count.
- Top-choice charts and average rankings, facilitator reflection prompts, passing, and anonymous group scores.
- Consent-based closing letter, revocation, link sharing and plain-text download.
- Clearly labeled solo practice with example participants.
- Responsive layouts, keyboard controls, reduced-motion support, self-hosted open-source fonts.

## Run

Node 22.13 or later. Install via the Sites install-dependencies helper (or `npm run install:ci`). `npm run dev` serves loopback at the printed URL, normally port 5173.

For a new local database: generate the build with `npm run build`, then apply the included schema migration once with:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_premium_adam_destine.sql
```

Hosted Sites deployment provisions D1 and applies the migration. The hosting manifest retains this site's identity. Create a separate Site identity if reusing this source for another hosted project.

## Checks

- `node node_modules/typescript/bin/tsc --noEmit`
- `node scripts/test-game.mjs`
- `npm run build`

The game tests cover host authorization, snapshot anonymity, all three scoring formats, letter consent and revocation, career substitution, and sensitive-scenario exclusion. A local end-to-end API test also exercised simultaneous joins and submissions against D1. A complete three-game practice flow was checked in the browser, including mobile layout and closing consent.

## Privacy and first-release limits

Setu collects no names or emails at the app layer. Anonymous device and host tokens authorize participation; do not share them. Platform access may still require sign-in. A room code grants access to room activity; response wording can identify a writer, so the UI asks participants to avoid identifying details. Group roles appear at reveal.

Rooms and letter links expire 24 hours after creation. Expired rows are removed when a new room is created; this is not a scheduled deletion guarantee. Hosting infrastructure may retain ordinary service logs. Shared letter links include only consented text. Exported downloads cannot be revoked.

The facilitator keeps the host tab open and advances each phase. A countdown closes submissions; it does not automatically advance the room. There are no persistent participant accounts, cross-session progress tracking, moderation console, or validated mental health outcomes. Practice data lasts only in the current page memory. New Sites are private: the owner must explicitly enable an appropriate sharing audience before other accounts can join.

## Source

Scenario content: the user-supplied Setu Google Doc (1UpNhdBzdeYLYzegwf3E5wd3IAOypIcU4EqEv6PxKeOY). Research informs the concept; this app does not claim to be a tested mental health intervention.
