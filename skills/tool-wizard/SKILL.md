---
name: tool-wizard
description: >-
  Orchestrates the user's coding tool belt — Keysmith, repo-memory, IGNITION,
  and the GitHub MCP server — in one coordinated sequence so a coding session
  can start with everything warm in seconds. Use this skill aggressively
  whenever the user wants the whole belt fired up together rather than calling
  tools separately. Trigger phrases include "/tool-wizard", "tool wizard",
  "fire it up", "fire up a repo", "kick off a project", "boot the toolbelt",
  "boot the tool belt", "warm up a repo", "get me warm on a repo", "start a
  session on a project", "spin up a repo", "open the kit on a project", or
  any request for a unified credentials plus memory plus session plus GitHub
  dashboard for a project. Also trigger when the user names a project and
  says they're "starting work" or "sitting down to code" without explicitly
  asking for a session — that is the canonical Tool-Wizard moment. When in
  doubt, trigger.
---

# Tool-Wizard

Conductor for the user's coding tool belt. Fires four MCP servers in a fixed
order against the same project and returns one dashboard.

## The non-negotiable rules

These rules exist because the conductor has burned the user before. Follow
them exactly.

1. **Always pass `project_path` explicitly to every tool that takes one.**
   In particular `mcp__keysmith__doctor` falls back to
   `KEYSMITH_DEFAULT_PROJECT` (currently `Open-Case`) when called with no
   args. That fallback will silently report against the wrong project. Never
   call any tool without the path — pass it on every single call.
2. **Resolve the project once, at the top, and reuse the result.** Do not
   re-resolve mid-run. Do not let parallel tool calls each guess.
3. **Read the GitHub slug from `.memory/current-state.md` first.** Only fall
   back to parsing `.git/config` if the slug isn't recorded. Never guess
   from the user's email handle.
4. **If IGNITION MCP isn't loaded, mark Phase 3 "pending Claude Desktop
   restart" and continue.** Do not abort the dashboard.

## Step 0 — Resolve the project path

Resolution order — stop at the first hit:

1. **Explicit path or repo name in the user's message** ("fire up Open-Case"
   → resolve "Open-Case"). If they gave a path, use it as-is.
2. **Most recently mentioned project in the conversation** (read recent
   turns; if exactly one project was being discussed, that's it).
3. **Read `.memory/current-state.md` from the cwd's repo** — if the file has
   a `project_path:` key in its YAML block, use that value.
4. **Search common roots in this order:**
   `~`, `~/code`, `~/dev`, `~/repos`, `~/Desktop`, `~/Documents`,
   `~/My tool kit`. Match case-insensitively. If multiple matches, ask once.
5. **Ask the user once** — do not guess wildly.

The result is `RESOLVED_PROJECT_PATH`. Pass it to every phase below.

## Step 1 — Read project metadata from `.memory/current-state.md`

Read `<RESOLVED_PROJECT_PATH>/.memory/current-state.md`. Extract any of
these keys from the YAML block:

- `project_name`
- `github_owner`, `github_repo`
- `default_branch`
- `ignition_binary`

If `github_owner` or `github_repo` is missing, fall back to parsing
`<RESOLVED_PROJECT_PATH>/.git/config`: find the `[remote "origin"]`
section, take the `url`, parse owner and repo from one of:
`https://github.com/<owner>/<repo>.git` or `git@github.com:<owner>/<repo>.git`.
Trim the trailing `.git`.

If neither source has it, ask the user once for the slug and persist it
back to `.memory/current-state.md` for next time.

## The four-phase sequence

Run the phases in this order. Each phase MUST receive `RESOLVED_PROJECT_PATH`
as its `project_path` argument where the tool accepts one.

### Phase 1 — Credentials (Keysmith)

Call `mcp__keysmith__doctor` with `project_path=<RESOLVED_PROJECT_PATH>`.
Required, not optional — see rule #1.

Surface:
- Credentials marked `missing` whose `detected_in` is non-empty (the
  project actually uses them — these are real blockers).
- Anything `expired` or `stale`.
- If the project has zero credentials in source, write "clean" and move on.

Never inject. Keysmith reports; the user authorizes injection.

### Phase 2 — Repo memory

Call `mcp__repo-memory__memory_start` (no args — it uses its own cwd).

If it errors with `.memory/ not found`, ask the user whether to run
`memory init` (a write — needs explicit consent). Do not silently init.

If it succeeds, surface:
- Canon (one paragraph from `memory_get_canon`).
- Active constraints (key invariants from `memory_get_constraints`).
- Most recent session summary, if any.

### Phase 3 — IGNITION session

First check whether IGNITION MCP is loaded by looking for any
`mcp__ignition__*` tool in the available tools.

- **Not loaded:** mark Phase 3 as
  `pending — IGNITION MCP not registered; restart Claude Desktop to load`.
  Continue with the rest of the dashboard. Don't abort.
- **Loaded:** call `mcp__ignition__ignition_current` first.
  - **Active session, same branch:** report task / duration / last
    checkpoint. Do not start a new one.
  - **Active session, different branch:** report and ask whether to resume
    or stop before starting fresh.
  - **No active session:** call `ignition_next` for carry-forward (todos /
    risks / questions). Suggest a task name. Ask whether to `ignition_begin`
    or `ignition_resume --latest`. Never silently start a session.

### Phase 4 — GitHub state

Use `github_owner` / `github_repo` from Step 1.

Call:
- `mcp__github__github_list_issues` with `state=open`.
- A PR-listing tool if available.

Surface:
- Open PRs the user authored (review-blocked first).
- Open issues assigned or labelled with anything from the canon /
  IGNITION carry-forward.
- Default branch's last commit (so the user knows whether to pull).

Read-only. Never open, comment, or merge in this phase.

## The dashboard

Return one structured summary. Use this template exactly — the layout is
stable per `dashboard-shape-stable` constraint.

```markdown
## Tool-Wizard report — <project name>

**Project:** <RESOLVED_PROJECT_PATH>
**Branch:** <current branch>

### 🔑 Keysmith
<one-line summary>
<bullets for blockers; omit if clean>

### 🧠 Repo memory
<one-line summary>
- Canon: <short paragraph or "not initialized">
- Constraints: <key invariants or "none recorded">
- Last session: <ISO date + one-line summary, or "no prior sessions">

### 🔥 IGNITION
<one-line status — active / paused / none / pending restart>
- <task / branch / duration if active>
- Carry-forward (from last stop): <todos, risks, questions if any>
- Suggested next: <begin / resume / nothing>

### 🐙 GitHub
- Open PRs (yours): <count + one-line per item>
- Open issues (assigned / labelled relevant): <count + one-line per item>
- Default branch latest: <commit summary>

### Next move
<one to three concrete suggestions, ordered by importance>
```

If a section has nothing notable, write *"clean"* and move on.

## Failure modes

- **One MCP server is down.** Keep going. Mark the failed phase. Three
  quarters of a dashboard is still useful.
- **The project path doesn't exist.** Stop. Ask once. Don't guess wildly.
- **Conflicting active state** (e.g., IGNITION session on a different
  branch than the repo is on): report the conflict, don't paper over it.
- **`KEYSMITH_DEFAULT_PROJECT` mismatch** (Keysmith reports a different
  project name than `RESOLVED_PROJECT_PATH`): you forgot to pass
  `project_path`. Re-call with the explicit path. This is the #1 bug.

## What this skill is not

- Not a session manager. IGNITION owns sessions; this skill orchestrates.
- Not a credential manager. Keysmith owns that; this skill only reports.
- Not a linter, formatter, or test runner.

## Extending the belt

If the user later adds another MCP server (e.g., a code-coverage tool, a
deployment status tool), add a new phase to the sequence. Each phase
should be: *call the tool's read-only inspect endpoint, surface what's
notable, never write*. New phases get appended, never inserted —
dashboard layout is stable.
