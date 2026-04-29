# Current state — Tool-Wizard / Chainwright

_Last updated: 2026-04-29 — end of Session 1 (the "ignite the belt" session)._

## What exists right now

**Six repos on github.com/Swixixle:**

- `Tool-Wizard` — **has content as of today.** Contains README, INSTALL,
  LICENSE, `tool-wizard.skill` bundle, `skills/tool-wizard/SKILL.md`,
  `.memory/`, `site/`, `prototype/`, `.github/workflows/deploy-pages.yml`,
  `.gitignore`. Local checkout at `~/My tool kit/Tool-Wizard/` is now a
  git repo, tracks `origin/main`.
- `Keyp-Away` (Keysmith) — exists on GitHub. Not checked out locally.
- `repo-memory` — exists on GitHub. **Local checkout at `~/repo-memory/`**
  (Node, dist/mcp/server.js is what claude_desktop_config.json launches).
- `IGNITION` — exists on GitHub. **TWO local checkouts: `~/IGNITION/`
  (older, sibling-package layout) and `~/Desktop/IGNITION/` (current,
  ignition.mcp subpackage layout).** The .mcp.json in the ignite plugin
  points at `~/Desktop/IGNITION/.venv/bin/ignition-mcp`. Older checkout
  unused; consider deleting.
- `github-mcp-server` — fix already merged on main. The
  `resolveLogDir()` helper + XDG_STATE_HOME-based path is in place.
  GitHub MCP works in this session.
- A ~6th repo not in scope here.

**Two deployment surfaces, both intentional:**

- **Netlify:** `http://tool-wizard-chainwright.netlify.app` — serves
  `site/index.html` (the side-by-side Tool-Wizard × Chainwright landing
  page). Site_id `5f82a677-9b91-448a-8d81-440947d6bfc7`. Last deploy
  `69f21ab4ba7e792b4f77a363` (ready).
- **GitHub Pages:** `https://swixixle.github.io/Tool-Wizard/` — will
  serve `prototype/index.html` once Pages workflow can run. Workflow
  exists at `.github/workflows/deploy-pages.yml`. **Currently blocked
  by a billing issue on the GitHub account**, not by the workflow.
  After billing clears: re-run the failed Action or push another commit.
  Pages source must be set to **GitHub Actions** in repo Settings (not
  "Deploy from a branch").

**Local toolbelt root:** `~/My tool kit/`
- Repo checkouts: Tool-Wizard (now git), ignition-mcp (separate from
  ~/Desktop/IGNITION).
- Four design PDFs: tool-wizard-design-notes, tool-wizard-studio,
  chainwright-library, friction-pattern-diagnostic.
- Helper scripts kept around for re-use:
  `push-tool-wizard.sh`, `wire-repo-memory.sh`, `closeout-session.sh`,
  `fix-logs-cwd-pr.sh` (defunct — fix already merged), `rebuild-mcp.sh`.

## Recent changes (this session)

**Toolbelt fixes:**
- IGNITION-MCP venv rebuilt at `~/Desktop/IGNITION` with `pip install -e
  ".[mcp]"`. The previous failure was a stale editable install whose
  `.pth` pointed at `~/IGNITION/src` (the wrong checkout). Server now
  connects.
- repo-memory MCP `cwd` was unset in `claude_desktop_config.json`.
  Added `"cwd": "/Users/alexmaksimovich/My tool kit/Tool-Wizard"`.
  Backup saved at `claude_desktop_config.json.bak-20260429-110437`.
  **Takes effect on next Cmd-Q + relaunch of Claude.** Until that
  relaunch, `memory_start` will still report "not initialized" because
  the running server still has the old (unset) cwd.

**Tool-Wizard repo:**
- Pushed all local content to `Swixixle/Tool-Wizard` main as commit
  `8d3358f` (`feat: bring local Tool-Wizard content onto main`). 12
  files, 1073 insertions.
- LICENSE retained from origin/main.

**Site:**
- Redeployed `site/` to Netlify (deployId 69f21ab4ba7e792b4f77a363).

**github-mcp-server:**
- Found the fix already merged on origin/main; PR was unnecessary. The
  patch script's assertions failed because the file is in post-patch
  shape. The previous "currently broken" note in this file was stale.

**Cursor's parallel work (merge `ebc33aa` + workflow tweak `8e8a920`):**
- Added `prototype/` folder with placeholder `index.html`,
  `diagnostic.html`, `library.html` and a `prototype/README.md` matching
  the spec (demos, real vs stub, classifier contract, deferred, editing).
- Added `.github/workflows/deploy-pages.yml` (split into `build` +
  `deploy` jobs, with `workflow_dispatch` for manual reruns).
- Merged origin/main with the local push and reconciled `.memory/`
  conflict by keeping the tracked (origin) version.
- Rewrote root `README.md` to merge richer origin/main content with the
  local one and append a Live demo section linking to the Pages URL.

## What's true that wasn't obvious

- The `github-mcp-server` "broken" status in the previous current-state
  was outdated. It's fixed and working.
- The `.memory/` was already populated; `memory_start` was failing
  purely because the MCP server's cwd was unset. Cwd is the *only*
  knob — the dist server doesn't honor any env var override.
- Switching repo-memory between projects requires editing
  `claude_desktop_config.json` and restarting Claude. The
  `wire-repo-memory.sh` script automates the edit; the restart is on
  the user.
- The four-PDF library at `~/My tool kit/` is the source of truth for
  Chainwright design; the prototype/ HTMLs are intended to be Cowork
  exports of the **studio**, **diagnostic**, and **library** PDFs once
  the user pastes the real exports in.
- Tool-Wizard now has TWO public deploy surfaces (Netlify + Pages) for
  TWO different purposes (landing page vs. interactive demos). They are
  not redundant.

## Next priorities

1. **Resolve the GitHub billing block.** Without it the Pages workflow
   can't run, and `prototype/` stays invisible on the public web. After
   billing clears: Actions tab → failed run → Re-run jobs.
2. **Replace `prototype/` placeholders with real Cowork HTML exports.**
   `prototype/index.html` ← **tool-wizard-studio**,
   `prototype/diagnostic.html` ← **friction-pattern-diagnostic**,
   `prototype/library.html` ← **chainwright-library**. Once these are
   real, the partial-match demo (the orange-banner, gap-analysis check
   for *"approval workflow with budget tracking for vendor purchases"*)
   becomes meaningful.
3. **Cmd-Q + relaunch Claude** so the repo-memory cwd fix takes effect.
   Verify with `ignite Tool-Wizard` in a new chat — `memory_start` should
   now load canon/constraints/state instead of erroring.
4. **Decide Chainwright repo strategy.** The prototype/ folder
   inside Tool-Wizard implicitly answers "monorepo, not separate repo".
   Confirm and document this in canon.
5. **Build the actual Chainwright classifier and recipe library.** The
   8 friction patterns are defined in canon; the library catalog is
   sketched in `chainwright-library.pdf`. v1 should be a keyword
   classifier returning the frozen `{ pattern, confidence, evidence,
   alternatives, ranked_matches }` shape.
6. **v2 CLI (`tw fire …`) and v3 Mac Shortcut** — defer, not blocking.

## Open questions

- 9th friction pattern (Versioning) — promote into the library or defer?
- Should the four design PDFs live in `docs/` inside the repo, or stay
  external in `~/My tool kit/`?
- Canonical public URL: Netlify landing or Pages demo? Decide before
  any custom-domain work.
- Delete `~/IGNITION/` (older checkout) to prevent future package-layout
  drift?
