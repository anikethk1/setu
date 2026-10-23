# Setu

Setu is an anonymous conversation game for students and parents. You can play with other people using a room code, or try a solo practice game with clearly labeled example players.

**Live website:** [https://setu.anikethkalagara.com](https://setu.anikethkalagara.com)

**Source code:** [github.com/anikethk1/setu](https://github.com/anikethk1/setu)

This guide is written for someone who is learning or using an AI coding assistant. You do not need a Cloudflare account, database password, or ChatGPT login to run Setu on your own computer.

## 1. Install the two tools you need

You only do this once on each computer.

1. Install **Node.js 24** from [nodejs.org](https://nodejs.org/en/download). Node includes `npm`, which installs the app's building blocks.
2. Install **Git** from [git-scm.com](https://git-scm.com/downloads). On a Mac, opening Terminal and typing `git --version` may offer to install Apple's command-line tools; accept that installation.
3. Close and reopen your terminal after installing. On a Mac, use the **Terminal** app. On Windows, use **PowerShell** or **Git Bash**.
4. Check that the tools are available:

```sh
node --version
npm --version
git --version
```

Node should report a version starting with `v24`. If a command says "not found" or "not recognized," finish the relevant installation and reopen the terminal.

## 2. Get your own copy of Setu

"Clone" means download the code and its change history. Run these commands one line at a time:

```sh
cd ~
git clone https://github.com/anikethk1/setu.git
cd setu
npm ci
```

`npm ci` installs the exact dependency versions saved in the repository. It can take a few minutes. Warnings are not always errors; look for a command that stops or says it failed.

**Already have `~/setu`?** Do not clone over it. Open that folder instead:

```sh
cd ~/setu
git pull --ff-only
npm ci
```

If Git says you have local changes or cannot pull, ask your coding assistant to help preserve your work before updating. Do not delete your folder or reset your changes to make the message disappear.

`~` means your home folder. For Aniketh's Mac, `~/setu` is `/Users/anike/setu`.

## 3. Start the app on your computer

From inside the `setu` folder, run:

```sh
npm run dev
```

This prepares a **local-only database** automatically, applies any missing setup steps, and starts the app. You do not have to create tables or run a long database command yourself. Running it again is safe: already-applied setup steps are skipped.

Wait until the terminal prints a **Local** address. Open that address in your browser. It is normally:

**[http://127.0.0.1:5173](http://127.0.0.1:5173)**

- Keep that terminal open while you work.
- To stop the app, click the terminal and press **Control+C**.
- If the port is already in use, stop your other Setu terminal or use the different Local address printed by the app.
- `http` is normal for this local preview. The public website uses `https`.
- `127.0.0.1` means **this computer**. That address will not open your laptop's app on someone else's phone. Use the public website when testing across different devices.

**Local changes and local test rooms do not change the public website.**

## 4. Try all three games locally

From the home page, select a game card. Each card opens that game's own launcher:

| Game | What you do |
| --- | --- |
| Guess who said it | Write an anonymous answer, then guess whether responses came from students or parents. |
| Read the room (Prediction Markets) | Choose your own answer, then predict the other generation's most popular choice. |
| Beneath the surface (Scenario Triage) | Rank concerns, then predict the other generation's top concern. |

### Quick solo test

1. Click a game card.
2. Click **Practice this game**.
3. Complete the short introduction and click **I'm ready** (the button may display a curly apostrophe).
4. Click **Let's begin**.
5. Answer the question and submit. In the guessing game, also make your student/parent guesses.
6. Use **Start guessing**, **Reveal responses**, and the next-step buttons to move through the session. In practice, you are also the host.
7. Check the results and the closing letter. Repeat for the other game cards.

Example players in practice are simulated. They are not other people online.

### Multiplayer test on one computer

You need two separate browser sessions so the players do not share a saved identity.

1. In a normal browser window, choose a game and click **Host a multiplayer room**.
2. Copy the room code. The host can click **Join as a player**, choose **Student**, and finish the introduction.
3. Open an **incognito/private window**, or use another browser such as Firefox. Open the same local address there.
4. Choose **There's a seat for you**, enter the code, choose **Parent**, and finish the introduction.
5. Return to the host window. When both players are ready, click **Let's begin**.
6. Answer on both windows. Confirm that counts and results update in both. Updates can take about two seconds.
7. The host controls when a phase ends. A countdown closes answers; it does not automatically move everyone to the next phase.

Two ordinary tabs in the same browser profile can share the same player token. Use a private window or another browser for the second player.

### Automated checks

With the preview still running, open a **second terminal**, go to the same folder, and run:

```sh
cd ~/setu
npm run check
npm run test:local
npm run build
```

- `check` checks the code and the game rules, scoring, privacy, consent, and selected-game behavior.
- `test:local` checks that your running local homepage and multiplayer database respond correctly.
- `build` checks that the app can be packaged for production. It does **not** publish it.

A successful command ends without an error. If one fails, give your coding assistant the command and the error text and ask it to fix the issue before you publish.

## 5. Make updates with your coding assistant

1. Open the **`setu` folder** in your editor or AI coding tool.
2. Start `npm run dev` and keep the preview open beside your editor.
3. Ask for one clear change at a time. For example:

> Change the wording of the room invitation to be easier for parents to understand. Keep the anonymous player tokens, game rules, and consent controls working. Test the change locally first and show me what changed before publishing.

4. Save files. The local browser normally updates automatically; refresh if needed.
5. Try the affected screens yourself, including a narrow phone-sized view.
6. Run the three checks above. Do not publish while they are failing.

Useful places to look (or point your assistant):

| File or folder | What it controls |
| --- | --- |
| `app/page.tsx` | The screens, buttons, introduction, and game controls. |
| `app/globals.css` | Colors, spacing, typography, and phone layouts. |
| `app/lib/content.ts` | Questions, scenarios, answer choices, and game labels. |
| `app/lib/engine.ts` | Game phases, scoring, privacy, and letter consent. |
| `app/api/` | How different players share a room. |
| `AGENTS.md` | Instructions for an AI assistant working on this project. |

If you are changing the database or hosting, ask your assistant to read [the maintainer guide](docs/MAINTAINING.md) too.

## 6. Publish an update

Saving a file only changes your local copy. **Pushing a commit to GitHub's `main` branch starts the production release.** Only do that when you want the public site updated.

For a straightforward update, after testing:

```sh
git status
git diff
git add .
git commit -m "Describe the change you made"
git push origin main
```

Review the changed files first; do not include passwords or other private material. GitHub may ask you to sign in. A repository owner must give contributors permission to push. If Git asks for your name/email, set those to your own details or ask your assistant for help.

If terminal Git feels unfamiliar, [GitHub Desktop](https://desktop.github.com/) offers buttons to review changes, commit, and push the same repository. Ask your assistant to work on a separate branch and open a pull request if you want a review before merging into `main`.

### What happens after the push

1. **GitHub Actions** runs the code checks and production build. See [the Actions page](https://github.com/anikethk1/setu/actions).
2. **Cloudflare Workers Builds** notices the push to `main`, runs `npm run check && npm run build`, then runs `npm run deploy` only if that succeeds.
3. The deploy step applies any new database schema migrations and publishes the new app.
4. When Cloudflare reports a successful deployment, [the public website](https://setu.anikethkalagara.com) serves that version. Refresh the page to load the update.

Allow a few minutes. You can follow the release in **Cloudflare dashboard → Workers & Pages → setu → Builds**. A GitHub check alone is not proof that Cloudflare finished deploying. A failed build should leave the previous working deployment available.

You do **not** need to paste Cloudflare credentials into code, manually upload files, or change domain DNS for normal updates.

## 7. Test the production website

After the Cloudflare deployment succeeds:

1. Open **[https://setu.anikethkalagara.com](https://setu.anikethkalagara.com)** in a fresh/private browser window.
2. Confirm it opens without a ChatGPT sign-in and uses HTTPS.
3. Repeat the solo test for the game you changed.
4. For multiplayer, use a laptop and phone (or two separate browser sessions), create a new room, and have one student and one parent join.
5. Confirm both players see the same phase and results. Check the closing-letter sharing choices if you changed them.
6. Keep test responses fictional; test rooms expire after 24 hours.

You can also run this **read-only** production check from your local folder:

```sh
npm run test:production
```

It checks the public homepage, anonymous access, the database connection, a trusted HTTPS connection, and the HTTP-to-HTTPS redirect. It also prints the deployed Git commit when available, so you can compare it with the commit on GitHub or Cloudflare. It does not create a production game room.

## Common problems

| What you see | What to do |
| --- | --- |
| `npm` or `node` not found | Install Node.js 24, close the terminal, and reopen it. |
| Folder `setu` already exists | Use `cd ~/setu`; do not clone over your work. |
| `Cannot find module` or missing packages | Run `npm ci` in the `setu` folder, then try again. |
| Local database/table error | Stop the server and run `npm run dev` again. It reapplies missing local migrations automatically. |
| Local page does not load | Keep `npm run dev` running and use the exact Local URL printed in that terminal. |
| Second window looks like the first player | Use incognito/private mode or another browser. |
| Room will not start | At least one student and one parent must finish their introductions. The host then starts the game. |
| The timer ended but the screen did not change | The host needs to advance the phase. |
| Local changes are not on the public site | Commit and push to `main`, then wait for a successful Cloudflare build and deployment. |
| Push is rejected | Pull changes carefully or ask your assistant for help. Do not force-push over someone else's work. |
| A release broke something | Ask your assistant to create a new commit reverting the bad change, test it, and push it to `main`. Do not delete Git history. |

## About the project

Setu draws its scenarios from the supplied Setu proposal. Its design is informed by research; the app does not claim to be a validated mental health intervention.

Setu collects no names or emails in gameplay. Players can skip questions. Hypothetical mental health scenarios require everyone's opt-in, and only approved text appears in shared letters. Answers can still reveal identity through their wording, so avoid identifying details. Rooms and letter links expire after 24 hours; expired rows are cleaned up when new rooms are created. Downloads already saved by someone cannot be recalled.
