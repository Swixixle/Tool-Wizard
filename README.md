# Tool-Wizard

A smart tool-kit builder. The user owns a coding tool belt; Tool-Wizard is
the conductor that gets every instrument playing on the same project, on
command.

## The belt

| Tool | What it does | How it joins the belt |
|------|--------------|-----------------------|
| **Keysmith** | Credential health + injection | MCP server (`keysmith_*` tools) |
| **repo-memory** | Project canon, constraints, prior session state | MCP server (`memory_*` tools) |
| **IGNITION** | Bounded coding sessions with checkpoints + receipts | MCP server (`ignition_*` tools) |
| **GitHub MCP** | Read/write bridge to the actual repo | MCP server (`github_*` tools) |

Each one is independently useful. The pain Tool-Wizard solves is the gap
between *opening the laptop* and *having all four tools warm on the same
project*. Without the conductor that's four prompts and four cognitive
context switches; with it, that's one phrase.

## Versions

This is a multi-form-factor project. The same orchestration logic gets
exposed in three places, in this order:

### v1 — Cowork chat skill (this commit)

A skill installed in Cowork. Trigger phrases like *"fire up Open-Case"*
or *"/tool-wizard"* make Claude run the four-phase orchestration and
return a unified dashboard. Lives in `skills/tool-wizard/SKILL.md`.

Zero install on the runtime side — the four MCP servers already do all
the work. The skill is just the conductor's score.

### v2 — Terminal CLI (planned)

A small Python package + console script:

```bash
tw fire ~/Open-Case
```

Same orchestration without needing to open a chat. Useful when the user
is already in the terminal and just wants the dashboard printed.

### v3 — Mac Shortcut (planned)

A literal button in the menu bar / a hotkey that calls the CLI on the
"current" repo (resolved from a configured default or the foremost VS
Code/Cursor workspace).

## Repo layout

```
Tool-Wizard/
├── README.md                       (you are here)
├── INSTALL.md                      how to install the v1 skill in Cowork
├── skills/
│   └── tool-wizard/
│       └── SKILL.md                the v1 chat skill
├── cli/                            (v2 — not yet implemented)
└── shortcuts/                      (v3 — not yet implemented)
```

## Design principles

- **Read first, write never (in v1).** The conductor reads state from
  every tool; it never writes. Writes (init, begin a session, comment on
  a PR) happen only after the user explicitly asks for them. This keeps
  Tool-Wizard from becoming a place where surprising side effects hide.
- **Each tool stays sovereign.** Keysmith owns creds; IGNITION owns
  sessions; repo-memory owns project knowledge; GitHub MCP owns the repo.
  Tool-Wizard never duplicates their logic — it composes them.
- **One unified report shape.** The dashboard layout in the skill is
  fixed so the user's eye learns it. New phases get added to the bottom;
  the existing sections don't move around.
- **Trigger eagerly, defer politely.** Better to fire up the belt when
  the user only wanted one tool (and short-circuit) than to miss the
  moment they wanted everything orchestrated.

## Adding a new tool to the belt

1. Install the new MCP server (Cowork → Settings → Connectors).
2. Pick a phase in the SKILL.md sequence where it fits, or add a new
   one. Phases run in order; later phases can use earlier outputs.
3. Add a section to the dashboard template with the same compact shape.
4. Update the trigger description in SKILL.md frontmatter only if the
   new tool unlocks new natural-language phrases the user would say.

## Status

- v1 skill: **drafted** — see `skills/tool-wizard/SKILL.md`.
- v2 CLI: **not started**.
- v3 Mac Shortcut: **not started**.
