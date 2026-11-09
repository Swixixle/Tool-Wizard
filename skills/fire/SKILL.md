---
name: fire
description: >-
  Universal one-word project warm-up. The user types ONE word — "fire",
  "/fire", "fire up", "boot up", "warm up", "light it up", "kick it
  off", "let's go", or "start" — and this skill loads everything for
  whichever project folder is currently mounted in the Cowork session.
  No path argument. No project name. No Cmd-Q. No restart. The mounted
  Cowork folder IS the project. Reads .memory/, runs Keysmith, lists
  open GitHub issues, returns a five-line dashboard. Works on every
  project the user has — Receipts, Tool-Wizard, Open-Case, anything
  with a `.memory/` folder. This is the canonical fire-up verb;
  trigger eagerly on any request that means "warm up the tools so I
  can start working on this project."
---

# fire

`fire` is the universal one-word project warm-up. The user has been
burned by per-project scripts and broken MCP cwd dances. This skill is
the durable replacement: pure file reads + the MCPs that already work,
no daemon to restart, no config to edit, no path to type.

## The user contract

User types `fire` (or any trigger phrase). In under fifteen seconds
they see a five-line dashboard for whatever project they're in, and
the project's full memory is loaded into the conversation so they can
start working immediately.

That's the whole contract. Anything that gets in the way of that —
asking which project, asking for paths, asking to scaffold things —
violates it. Defaults beat questions.

## How to determine the project

In priority order:

1. **The user named a project** in their message
   (e.g., "fire up Receipts"). Resolve via the roots in step 4.
2. **Exactly one Cowork folder is mounted** in this session. That
   folder IS the project. Use it. Don't ask.
3. **Multiple Cowork folders mounted** — pick the one that has a
   `.memory/` subfolder. If exactly one does, use it. If more than
   one does, list them and ask once: *"You have N projects mounted
   with `.memory/` folders — which one?"*
4. **No Cowork folder mounted** — try `~/Personal-Podcast`,
   `~/My tool kit/Tool-Wizard`, then `~`, `~/Desktop/`,
   `~/Documents/`, `~/code/`, `~/dev/`, `~/repos/` for any directory
   containing `.memory/`. If exactly one match, use it. If multiple
   or none, ask once.

Always resolve `~` to the user's home directory. Always log the
resolved path in the dashboard so the user knows what got loaded.

## Procedure (run in parallel where possible)

Once the project root is known, dispatch these in a single tool batch:

1. **Read** `<root>/.memory/canon.md`
2. **Read** `<root>/.memory/constraints.yaml`
3. **Read** `<root>/.memory/current-state.md`
4. **Call** `mcp__keysmith__doctor` with `project_path = <root>`

After those return, parse `current-state.md` for the YAML block
containing `github_owner:` and `github_repo:`. With those:

5. **Call** `mcp__github__github_list_issues` with the parsed
   `owner` and `repo`, `state="open"`.

Optionally, also list `<root>/.memory/sessions/` (via `Glob` or a
shell `ls`) and read the newest file's first paragraph.

If `<root>/.memory/` doesn't exist, **stop** and ask: *"No `.memory/`
at `<root>` — want me to scaffold the skeleton?"* Don't silently
create. The placeholder template is at the end of this file.

If `current-state.md` is missing or has no GitHub slug, skip step 5
and note it in the dashboard. Don't fail.

If a tool errors (Keysmith, GitHub), note the failure in that
section and continue. Three quarters of a dashboard beats none.

## The dashboard

Output exactly this shape — short, scannable, the same every time:

```markdown
## 🔥 <Project Name> — fired

**Path:** <absolute path>  ·  **Phase:** <phase from constraints.yaml>

**Canon:** <first sentence of canon.md, no formatting>

**🔑 Keysmith:** <"clean" | "<N> creds, <M> missing in source">
**🐙 GitHub (<owner>/<repo>):** <"clean" | "<N> open: <first 3 titles, comma-separated, …>">
**🧠 Last session:** <ISO date + one-line summary | "no prior sessions">

<empty line>
*Loaded N invariants and N forbidden moves from constraints. Project context is now in this conversation — start working.*
```

Keep it tight. The user is reading this to orient, not to audit.
Don't add commentary, don't suggest "next moves", don't ask what to
do next. They know what they're doing — get out of the way.

## What this replaces

- The `repo-memory` MCP (the cwd-bound one that needs Cmd-Q to
  switch projects). Keep the MCP installed if you want, but `fire`
  doesn't use it. `fire` reads `.memory/` directly with `Read`.
- `memhere.sh` and `wire-repo-memory.sh`. Both were workarounds for
  the cwd problem. With `fire`, there's no cwd to switch — every run
  reads fresh from disk for whatever project is mounted.
- The four-step `/ignite` sequence when the user just wants to start.
  `/ignite` (the existing skill) still exists for the full Phase 1–4
  experience including IGNITION sessions. `fire` is the lighter,
  more-reliable subset that always works because it doesn't depend
  on IGNITION being registered.

## Triggers — be aggressive

Trigger this skill when the user types or says:

- `fire`, `/fire`, `fire up`, `fire it up`, `fire 'em up`,
  `fire up the tools`, `fire up <project>`
- `boot up`, `warm up`, `light it up`, `kick it off`, `let's go`,
  `let's go go go`, `start`, `up`
- A bare project name when said at the start of a session with
  evident intent to begin work (e.g., user opens Cowork, mounts a
  folder, types just "Receipts" — that's a fire signal)
- Any phrasing that means "I'm sitting down to work on this
  project, get me ready"

When in doubt, **fire**. The user has been waiting three hours for
this to be one-shot. False positives cost a 15-second skill run.
False negatives cost their entire morning.

## Failure modes

- **No `.memory/`.** Ask once whether to scaffold. Don't silently
  create.
- **Keysmith returns nothing.** That's a clean state — say "clean"
  in the dashboard.
- **GitHub MCP errors.** Note in the dashboard ("GitHub: error
  fetching issues — `<short reason>`") and keep going.
- **Multiple mounted projects.** Ask once, then proceed.
- **Path doesn't exist.** Stop, ask once, don't guess wildly.

## Placeholder skeleton (only if user asks to scaffold)

`<root>/.memory/canon.md`:

```markdown
# <Project Name> — Canon

What it is: <one paragraph>

What it is not: <one paragraph>
```

`<root>/.memory/constraints.yaml`:

```yaml
phase: <name the current phase>

invariants: []

forbidden_moves: []

current_focus: []
```

`<root>/.memory/current-state.md`:

```markdown
# <Project Name> — Current State

Initialized <YYYY-MM-DD>.

```yaml
project_name: <name>
project_path: <absolute path>
github_owner:
github_repo:
default_branch: main
```

## Open items

- (fill in)
```

`<root>/.memory/sessions/.gitkeep`: empty file.

After scaffolding, run `fire` again on the same path to load the
fresh skeleton.

## What this skill is not

- Not a session manager (no IGNITION dependency).
- Not a credential editor (Keysmith reports; user fixes).
- Not a writer (no commits, no PR comments, no file mutations
  except the optional skeleton scaffold).
- Not project-specific. One skill, every project.
