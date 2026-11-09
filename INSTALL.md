# Tool-Wizard plugin — install

This repo ships **two skills** in one Claude plugin:

- `skills/tool-wizard/SKILL.md` — the canonical conductor (verb: `tool wizard`,
  `/tool-wizard`, "fire it up", etc.).
- `skills/ignite/SKILL.md` — the one-word alias (verb: `ignite`, `/ignite`,
  "press ignition"). Same procedure, different trigger.

It also bundles the IGNITION MCP server config (`.mcp.json` at the repo
root) so installing the plugin auto-registers IGNITION-MCP — no separate
`claude_desktop_config.json` edits required.

## Prerequisites

The other three MCPs must already be wired into Cowork:

- **Keysmith** — `mcp__keysmith__*`
- **repo-memory** — `mcp__repo-memory__*`
- **GitHub MCP** — `mcp__github__*`

IGNITION's binary lives at
`/Users/alexmaksimovich/Desktop/IGNITION/.venv/bin/ignition-mcp` (built from
`~/My tool kit/ignition-mcp`). The plugin's `.mcp.json` already points at
that path. If you move IGNITION, update both files.

If a phase's MCP isn't installed, the conductor notes it in the dashboard
and skips the section instead of crashing. You'll get more value with all
four available.

## Install (Cowork)

1. From this folder, package the plugin:

   ```bash
   cd "/Users/alexmaksimovich/My tool kit/Tool-Wizard"
   zip -r tool-wizard.plugin .claude-plugin .mcp.json skills
   ```

   That `.plugin` is just a zip with a known extension; Cowork knows
   how to install it. (Older versions used `.skill` for skill-only
   bundles. `.plugin` is the right format because we now ship an
   `.mcp.json` too.)

2. Cowork should render a **"Install plugin"** button on the
   `.plugin` file when I present it back to you. Click it.

3. **Restart Claude Desktop** so the MCP servers in the bundled
   `.mcp.json` are picked up. (This is a one-time step per install.
   Plain skill updates don't need a restart — only `.mcp.json`
   changes do.)

## Verify it's loaded

Type `/ignite` or `/tool-wizard` — Claude should:

1. Resolve the project from `.memory/current-state.md` (or ask once).
2. Run Keysmith doctor with the explicit `project_path`.
3. Run repo-memory `memory_start`.
4. Check IGNITION (`mcp__ignition__ignition_current`).
5. Hit GitHub with the slug from `.memory/current-state.md`.
6. Return one dashboard.

If Phase 1 reports a project name OTHER than the one you asked for,
the conductor shortcut the `project_path` arg — re-read the SKILL.md
non-negotiable rules, or report it as a bug.

## Update the skills

Edit `skills/tool-wizard/SKILL.md` and/or `skills/ignite/SKILL.md`,
re-package, re-install. No version pinning to worry about.

## Hot-deploy a SKILL.md change without re-packaging

If you only changed a SKILL.md (no `.mcp.json` change, no plugin
manifest change), you can copy the file directly into the active
plugin install and skip the package + reinstall step:

```bash
PLUGIN_DIR="$HOME/Library/Application Support/Claude/local-agent-mode-sessions"
# Find the active install of the ignite plugin:
find "$PLUGIN_DIR" -path "*/rpm/*/skills/ignite/SKILL.md" -print

# Then for each match, replace it with the source from this repo:
SRC="/Users/alexmaksimovich/My tool kit/Tool-Wizard/skills/ignite/SKILL.md"
find "$PLUGIN_DIR" -path "*/rpm/*/skills/ignite/SKILL.md" \
  -exec cp "$SRC" {} \;
```

Same pattern for `tool-wizard/SKILL.md`. SKILL.md text is read on
session start — open a new chat to pick up the change.

## Uninstall

Cowork's plugin UI has a remove option. Removing the plugin removes
both skills and the IGNITION MCP entry. The other three MCP servers
(Keysmith, repo-memory, GitHub) are independent of this plugin.
