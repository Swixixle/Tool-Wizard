# Tool-Wizard skill — install

The v1 skill lives at `skills/tool-wizard/SKILL.md`. It needs to be
loaded into Cowork as an installable skill before Claude will pick up
the trigger phrases.

## Prerequisites

You need the four MCPs from the tool belt already wired into Cowork:

- **Keysmith** — `mcp__keysmith__*`
- **repo-memory** — `mcp__repo-memory__*`
- **IGNITION** — `mcp__ignition__*` (run `~/My tool kit/ignition-mcp/install.sh` if you haven't yet)
- **GitHub MCP** — `mcp__github__*`

Tool-Wizard is the conductor — it expects the orchestra to be in the
room. If a phase's MCP isn't installed, the skill notes it in the
dashboard and skips the section instead of crashing, but you'll get
more value by having all four available.

## Install (Cowork)

1. From this folder, package the skill:

   ```bash
   bash "/Users/alexmaksimovich/My tool kit/Tool-Wizard/package.sh"
   ```

   (Or run the skill-creator's `package_skill.py` directly — see below.)

   This produces `tool-wizard.skill` next to the SKILL.md. A `.skill` is
   just a zip with a known extension; Cowork knows how to install it.

2. Cowork should render a **"Save skill"** install button on the
   `.skill` file when I present it back to you. Click that.

3. Restart the chat (or start a new one) so the skill list refreshes.

## Verify it's loaded

Type `/tool-wizard` or just say *"fire it up"* — Claude should ask
which project and then run the four-phase orchestration. If nothing
happens, the skill description didn't trigger and we need to tune it.
That's iteration territory; tell me and we'll re-run the trigger evals.

## Update the skill

Skills are tiny — usually you just edit `skills/tool-wizard/SKILL.md`,
re-package, re-install. There's no version pinning to worry about.

## Uninstall

Cowork's skill UI has a remove option. The four MCP servers are
independent of this skill, so removing Tool-Wizard does not affect
Keysmith, IGNITION, etc.

## Manual packaging (alternative)

If the convenience script is missing or you want to do it by hand:

```bash
SKILL_DIR="/Users/alexmaksimovich/My tool kit/Tool-Wizard/skills/tool-wizard"
python3 -m scripts.package_skill "$SKILL_DIR"
```

That's the `package_skill.py` tool from Anthropic's skill-creator skill,
which is shipped with Cowork. The output is a `.skill` file you can
install via the same flow as above.
