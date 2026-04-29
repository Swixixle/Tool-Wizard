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

Tool-Wizard is the conductor for the user's coding tool belt. The belt is
four MCP servers the user installed earlier:

- **Keysmith** — credential health and injection.
- **repo-memory** — project canon, constraints, and prior session state.
- **IGNITION** — bounded coding sessions with checkpoints and receipts.
- **GitHub MCP** — read/write bridge to the actual repository.

Each tool is independently useful. Tool-Wizard makes them play together: it
runs them in the right order against the same project, threads context from
one into the next, and returns a single dashboard so the user knows what's
loaded and what needs attention before they start coding.

## Why this matters

Without Tool-Wizard the user has to remember:

1. Did I check creds? (Keysmith)
2. Is this repo's memory loaded, or do I need to init? (repo-memory)
3. Do I have an active session, and if not should I start or resume? (IGNITION)
4. What's the state of GitHub — open PRs, unmerged work, blocking reviews?

That's four separate prompts and four separate cognitive steps. Tool-Wizard
collapses it to one command and one dashboard. The user opens their laptop,
says "fire up Open-Case", and is in a tracked session with creds verified,
memory loaded, and GitHub state surfaced — in under a minute.

## When to trigger

Trigger eagerly. The cost of triggering when the user only wanted a single
tool is small (you can short-circuit after running just that phase). The
cost of NOT triggering when the user wanted the belt is high — they have to
manually re-state the orchestration.

Trigger when the user:

- Says any of the trigger phrases in the description.
- Names a repo and says they're starting / sitting down / coming back to it.
- Asks for a "status across everything" or "where am I" on a project.
- Wants a single unified report combining credentials, sessions, and repo state.

Do **not** trigger when the user is clearly asking for one specific tool
(e.g., "run keysmith doctor", "what's the canon say"). Defer to the direct
tool call there.

## Inputs

The skill needs a project path. Resolution order:

1. Explicit path or repo name in the user's message
   (e.g., "fire up Open-Case" → ``/Users/<user>/Open-Case``).
2. The most recently mentioned project in the conversation.
3. Ask the user once: *"Which project should I fire up?"* — then proceed.

Repo names get resolved by trying common roots (``~``, ``~/code``,
``~/dev``, ``~/repos``) before asking. If multiple matches, ask the user
to pick.

## The four-phase sequence

Always run the phases in this order. Threading order matters — later phases
read what earlier phases discovered (e.g., the GitHub phase uses the repo's
remote, which the memory phase confirms).

### Phase 1 — Credentials (Keysmith)

Call ``mcp__keysmith__doctor`` with ``project_path`` set to the resolved
project root.

What you're checking:

- Are required env vars present (in keychain or ``.env``)?
- Are any credentials marked ``missing`` that the project actually uses
  (i.e., they appear in source under ``detected_in``)?
- Are any credentials expired or stale?

Surface anything that's blocking. If a credential is missing AND the project
clearly uses it (multiple ``detected_in`` entries), call this out as a
red-flag finding the user should resolve before serious work. Don't try to
inject anything yourself — Keysmith's job is to report; only the user
authorizes injection.

### Phase 2 — Repo memory

Call ``mcp__repo-memory__memory_start`` with the project path.

If it errors with *".memory/ not found — run memory init"*, do not silently
init. Tell the user the repo isn't memory-initialized and ask whether to
run ``memory init``. Initializing creates files in their repo, which is a
write they should approve.

If memory_start succeeds, capture and surface:

- The project canon (one short paragraph from ``memory_get_canon`` if needed).
- Active constraints (key invariants, things not to break).
- The most recent session summary, if any — what was last done on this repo.

This is the "where I left off" piece, but pulled from repo-memory rather
than IGNITION (IGNITION is the next phase and is session-scoped; repo-memory
is project-scoped).

### Phase 3 — IGNITION session

Call ``mcp__ignition__ignition_current`` first to see whether a session is
already active.

- **Active session on the same branch:** report it (task, duration, last
  checkpoint) and *do not* start a new one.
- **Active session on a different branch:** report it and ask whether to
  resume it (``ignition_resume``) or stop it before starting fresh.
- **No active session:** call ``ignition_next`` to fetch the last-stop
  carry-forward block from this branch (todos / risks / questions). Use
  that to suggest a task name. Then ask the user whether to:
  - ``ignition_begin`` with a suggested task, or
  - ``ignition_resume --latest`` if there's an unfinished session.

Never silently start a session. The session frames the work and writes a
receipt; the user should consciously open it.

### Phase 4 — GitHub state

Call ``mcp__github__github_list_issues`` and (if available) any PR-listing
tool to surface:

- Open PRs the user authored, especially review-blocked ones.
- Open issues assigned to the user or labelled with anything that came up
  in the memory canon / IGNITION carry-forward.
- The default branch's last commit (so the user knows whether to pull).

Do not open PRs or comment on anything in this phase. This is read-only
context. Anything that needs writing happens later, deliberately, with the
user driving.

## The dashboard

After all four phases, return one structured summary. Use this template
exactly — consistency matters because the user's eye learns the layout:

```markdown
## Tool-Wizard report — <project name>

**Project:** <absolute path>
**Branch:** <current branch>

### 🔑 Keysmith
<one-line summary, e.g. "9 creds present, 4 missing — only API_KEY is actually used in source.">
<bullet list of issues that need user action; omit section if clean>

### 🧠 Repo memory
<one-line summary>
- Canon: <short paragraph or "not initialized">
- Constraints: <key invariants or "none recorded">
- Last session: <ISO date + one-line summary, or "no prior sessions">

### 🔥 IGNITION
<one-line status — active / paused / none>
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

Keep each section short. The user is reading this to orient — not to
audit. If a section has nothing notable, write *"clean"* and move on.

## Examples

**Example 1: clean fire-up**

User: *"fire up Open-Case"*

Tool-Wizard resolves ``/Users/<user>/Open-Case``, runs the four phases,
finds an active IGNITION session from this morning on
``feature/api-hardening``, no missing creds in actual use, no blocking PRs.

Returns the dashboard with "IGNITION: active" and a one-line "Next move:
``ignition_status`` to confirm scope before adding tests."

**Example 2: stale memory + missing cred**

User: *"kick off Tool-Wizard"*

Resolves ``~/My tool kit/Tool-Wizard``. memory_start errors (not
initialized). Keysmith reports nothing because there are no creds in source
yet. No IGNITION session.

Returns the dashboard with "Repo memory: not initialized — run
``memory init``?" as the suggested next move, and "IGNITION: not started —
run ``ignition_init`` once the repo is ready."

**Example 3: branch mismatch**

User: *"warm up IGNITION repo, I'm gonna fix the receipt schema"*

Resolves ``~/IGNITION``. Active IGNITION session is on
``feature/handoff-rewrite``. User wants to work on a different branch.

Skill explicitly asks: *"There's already an active IGNITION session on
``feature/handoff-rewrite`` — should I stop it and start a fresh one for
the schema work, or are we resuming the handoff session?"* before doing
anything.

## Failure modes

- **One MCP server is down.** Keep going. Mark the failed phase in the
  dashboard with a note explaining what wasn't checked. Don't abort the
  whole run — three quarters of a dashboard is still useful.
- **The project path doesn't exist.** Stop. Ask once. Don't guess wildly.
- **Conflicting active state** (e.g., IGNITION session on a different
  branch than the repo is currently on): report the conflict instead of
  papering over it.

## What this skill is not

- Not a session manager. IGNITION owns sessions; this skill just orchestrates.
- Not a credential manager. Keysmith owns that; this skill only reports.
- Not a linter, not a formatter, not a test runner. Adding a tool to the
  belt is a separate, deliberate decision — don't slip new behaviour in
  through Tool-Wizard.

## Extending the belt

If the user later adds another MCP server (e.g., a code-coverage tool, a
deployment status tool), add a new phase to the sequence in this skill.
Each phase should be: *call the tool's read-only inspect endpoint, surface
what's notable, never write*.
