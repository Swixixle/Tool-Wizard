# Tool-Wizard — Current State

Initialized 2026-05-01. Hardened the conductor 2026-05-01 so `/ignite` is one-shot.

## Project metadata

The conductor (ignite / tool-wizard skill) reads this block on every run.
Keep the keys exactly as below — the skill greps for them.

```yaml
project_name: Tool-Wizard
project_path: /Users/alexmaksimovich/My tool kit/Tool-Wizard
github_owner: Swixixle
github_repo: Tool-Wizard
default_branch: main
ignition_binary: /Users/alexmaksimovich/Desktop/IGNITION/.venv/bin/ignition-mcp
keysmith_default_project_warning: |
  KEYSMITH_DEFAULT_PROJECT is set to Open-Case in the host env.
  ALWAYS pass project_path explicitly to mcp__keysmith__doctor.
  Do not rely on the default — it will silently report against the wrong project.
```

## Open items

- IGNITION MCP server: binary verified at the path above. Tools register on the
  next Claude Desktop restart. Until then, Phase 3 reports "pending restart" and
  the rest of the dashboard fires normally.
- (resolved 2026-05-01) GitHub slug confirmed: `Swixixle/Tool-Wizard`.
- (resolved 2026-05-01) Project resolution: `~/My tool kit/Tool-Wizard` is now
  in the skill's resolution roots; falls back to this file's `project_path` key.
