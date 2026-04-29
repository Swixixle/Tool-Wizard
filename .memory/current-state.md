# Current state — Tool-Wizard / Chainwright

_Last updated: 2026-04-29 — first memory_init session. Older context
may exist in design PDFs at the toolbelt root; not yet consolidated here._

## What exists right now

**Five repos on github.com/Swixixle:**

- `Tool-Wizard` — empty on GitHub. Local checkout in
  `~/My tool kit/Tool-Wizard/` has README, INSTALL, the v1 SKILL.md, and
  a packaged `tool-wizard.skill` bundle (zip). Local content has not
  been pushed.
- `Keyp-Away` (Keysmith) — exists on GitHub. Not checked out locally.
- `repo-memory` — exists on GitHub. Not checked out locally. README
  defines the `.memory/` schema we're using here.
- `IGNITION` — exists on GitHub. Local sibling at `~/My tool kit/ignition-mcp/`
  is the Python MCP server (pyproject.toml + src/ignition_mcp).
- `github-mcp-server` — exists on GitHub. Currently broken: every tool
  call returns `ENOENT: no such file or directory, mkdir 'logs'` because
  `src/index.ts` constructs `new AuditLogger('./logs', signer)` with a
  relative path that resolves against the host's launch cwd.

**Local toolbelt root:** `~/My tool kit/`
- Two repo checkouts (Tool-Wizard, ignition-mcp), neither initialized as
  git repos locally.
- Four design PDFs: tool-wizard-design-notes, tool-wizard-studio,
  chainwright-library, friction-pattern-diagnostic. These define the
  Chainwright/educational direction not yet captured in any README.

## Recent changes (this session)

- Diagnosed github-mcp-server logs/ cwd bug.
- Wrote patch: `outputs/fix-logs-cwd.patch` (replaces `'./logs'` with an
  env-overridable absolute path under `~/.local/state/github-mcp-server/logs`).
- Confirmed Keysmith holds no GitHub token; PR can't be opened
  programmatically. Single-command shell script for the user to run
  locally is being prepared.
- Synthesized the four design PDFs. Established that Chainwright
  (library/diagnostic) and Tool-Wizard (conductor) are one product with
  two faces — captured in canon.md.
- Initialized `.memory/` (this folder).

## What's true that wasn't obvious

- The README's "v1 read-first, write-never" rule is *only* about the
  conductor (Tool-Wizard); the PDFs assume Chainwright users will
  adapt/build. These don't conflict — different tool, different
  contract — but the README should eventually call this out.
- Composition is contract-uniform, not monadic. The user has been
  asking the right question; the design notes don't currently lift the
  monad algebra (no bind/return/laws). This is captured in canon.md.
- The github-mcp-server's `fs.mkdir(dir, { recursive: true })` is
  *already correct* — the bug is purely at the call site in `index.ts`,
  not in `audit/logger.ts`. The fix is one file.

## Next priorities

1. **Open the github-mcp-server fix PR.** Patch is in
   `outputs/fix-logs-cwd.patch`; one-command script in
   `outputs/fix-logs-cwd-pr.sh` will be ready next. User runs it
   locally; PR opens against `Swixixle/github-mcp-server`.
2. **Deploy side-by-side docs site to Netlify.** Single page with two
   sections: Chainwright (friction patterns + recipe library outline)
   and Tool-Wizard (conductor docs). Static HTML; no build step.
3. **Wire repo-memory MCP cwd to Tool-Wizard.** For this `.memory/` to
   actually load, the MCP host config needs `cwd:
   ~/My tool kit/Tool-Wizard`. Currently the server's cwd appears to be
   somewhere else (memory_start failed earlier). Action item for the
   user.
4. **Push Tool-Wizard local content to GitHub.** README, INSTALL,
   skills/tool-wizard/SKILL.md, tool-wizard.skill, plus this `.memory/`
   folder. The github.com repo is currently empty.

## Open questions

- Should Chainwright be its own GitHub repo, or live as a folder inside
  Tool-Wizard? (PDFs imply integration; current repo split implies
  separation. Not yet decided.)
- For the docs site, what's the domain? Netlify default subdomain for
  v1, custom domain later.
- v2 CLI (`tw fire …`) and v3 Mac Shortcut — when do those start? Not
  blocking today.
- Versioning friction pattern (proposed 9th) — promote to library or
  defer?
