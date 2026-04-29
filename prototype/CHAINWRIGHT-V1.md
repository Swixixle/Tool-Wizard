# Chainwright v1 — Design Notes

This is the first written-out version of the Chainwright data layer and
classifier. It is intentionally drop-in replaceable: the classifier
returns a frozen shape so swapping the keyword scorer for an LLM swap
later doesn't ripple into the UI.

Source PDFs: `~/My tool kit/friction-pattern-diagnostic.pdf`,
`chainwright-library.pdf`, `tool-wizard-design-notes.pdf`,
`tool-wizard-studio.pdf`.

## Files

- **`prototype/data/patterns.js`** — 8 active friction patterns + 1
  proposed (Versioning). Each carries id, label, emoji, tagline,
  description, keyword list, and example friction sentences.
- **`prototype/data/library.js`** — 24 tools across the 8 patterns,
  the 6 named primitive-combos (Pipeline, Pulse, Drip, Scorecard,
  Ritual, Reuse Kit), and the primitives index.
- **`prototype/classifier.js`** — keyword-based classifier returning
  `{ pattern, confidence, evidence, alternatives, ranked_matches }`.
  Self-test harness included.

All three load as plain `<script>` tags — no build step, Pages-deployable.

## Classifier contract (frozen)

```ts
classify(text: string, opts?: { includeProposed?: boolean }): {
  pattern: string | null;     // friction pattern id of best match
  confidence: number;          // 0..1, share of total signal on top pattern
  evidence: string[];          // matched keywords for the top pattern
  alternatives: Array<{ pattern: string; confidence: number }>;
  ranked_matches: Array<{ tool_id: string; score: number }>;
}
```

This shape is locked. Any classifier implementation — keyword,
embedding-similarity, LLM — must return exactly this. The library, the
diagnostic UI, and any partial-match banner all depend on it.

### Scoring rules (v1, keyword)

- Phrases (keywords containing a space) score **2** per hit. They
  encode user-language signals like *"where is everyone"* or
  *"approval workflow"*.
- Single tokens score **1** per hit, matched against the tokenised
  input.
- `confidence = topScore / totalScore` — interpretable as "share of
  matched signal landing on the top pattern."
- `proposed` patterns (currently just Versioning) are skipped unless
  `includeProposed: true` is passed.

### When the result has low confidence

A `confidence < 0.5` with multiple `alternatives` near the top is the
"partial match" case the Studio handles with the orange banner +
gap analysis surface. The classifier doesn't decide the UI threshold —
it just reports the numbers honestly.

## The 8 friction patterns — concrete

Each pattern is named by the user-voice version of the pain, not a
solution. The library entries are the answers; the pattern is the
question.

| id | Pattern | One-line | Library entries |
|---|---|---|---|
| `memory_failure` | 🧠 Memory Failure | "I forgot what I captured before" | Recurring Checklist · Second Brain · Capture Inbox |
| `state_tracking` | 📊 State Tracking | "I don't know what stage this is in" | Lightweight Contact Tracker · Promise Engine · Podcast Guest Pipeline |
| `repetitive_language` | 📝 Repetitive Language | "I keep retyping the same intro emails" | Email Snippets · Adaptive Outreach Engine · Outreach Template Pack |
| `comparison_overload` | ⚖️ Comparison Overload | "I have 40 PDFs and can't rank them" | Multi-criteria Ranker · Document Q&A Pile · Candidate Scorecard |
| `dont_know_next` | 🧭 Don't-Know-Next | "What's my first move tomorrow?" | Next-Action Sticky · Decision Playbook · Morning Triage Card |
| `scattered_attention` | 🌪 Scattered Attention | "Where is everyone on my team?" | Weekly Digest Builder · Async Standup Bot · Team Pulse Dashboard |
| `collecting_from_others` | 📥 Collecting From Others | "How do I gather input without chaos?" | Shared Doc with Sections · Snowflake Collector · Submission Mailbox |
| `time_sensitive_triggers` | ⏰ Time-Sensitive Triggers | "I need reminders that branch on outcomes" | Single Alarm · Adaptive Drip · Drip Schedule |

### Each pattern has three library entries by design

Every pattern carries a **standard** entry (low setup, low complexity),
a **custom** entry (more powerful, higher setup), and either a
**second standard** (different shape) or — if appropriate later — an
**experimental** entry. This three-slot rule makes the library
predictable to browse: a friction always has a "minimum viable
answer", a "more capable answer", and an "alternative shape" within
arm's reach.

### Proposed 9th: Versioning

Spec'd in `tool-wizard-design-notes.pdf`. Distinct from Memory
(capturing first-time thoughts) and State (progress through stages) —
it's about preserving past goodness. Three sketched recipes
(Save-with-Note, Version Stack, Branching Forge) but no library
entries written yet. Keywords are in the classifier so it can light
up if a user describes that friction; UI can decide whether to show it.

## The 6 named combos — the grammar

These are the recurring primitive-clusters — the *grammar* of the
library. They aren't tools; they're the shape several tools share.
Naming them lets users recognise *"oh — that's the Pulse shape"* and
build from the pattern instead of from scratch.

| combo | Primitives | Exemplar tools |
|---|---|---|
| 🛤 The Pipeline | Tracker + Reminder Chain + Notes | Podcast Guest Pipeline, Promise Engine, Submission Mailbox |
| 📊 The Pulse | Form + Aggregator + Dashboard | Team Pulse Dashboard, Morning Triage Card, Async Standup Bot, Snowflake Collector |
| ⏰ The Drip | Reminder Chain + Template | Drip Schedule, Adaptive Drip |
| ⚖️ The Scorecard | Tracker + Scoring + Compare View | Candidate Scorecard, Multi-criteria Ranker |
| 🔔 The Ritual | Inbox/Checklist + Reminder Chain | Capture Inbox, Recurring Checklist |
| 📦 The Reuse Kit | Template + Snippet Library + Usage Log | Outreach Template Pack, Email Snippets, Adaptive Outreach Engine |

Per design notes: the combos are derivable at runtime from
`tools[*].primitives` (≈30 lines of grouping logic). They're stored
explicitly here for clarity, but a future pass could compute them.

## Constraints honoured

From `.memory/constraints.yaml`:
- **classifier-contract-frozen** — return shape locked.
- **primitives-stay-recombinant** — every primitive listed shows up in
  multiple recipes (verified: Tracker is in 5, Reminder Chain is in 8,
  Form is in 6, etc.).
- **confidence-marked-explicitly** — every tool carries a `maturity`
  level (Standard / Custom / Experimental).
- **plain-text-first** — patterns and library are JS-as-data; no DB,
  no embeddings, no vector store.

## What's not done yet

- The HTML demos (`prototype/index.html`, `diagnostic.html`,
  `library.html`) are still placeholders. They need to be wired to
  load these scripts and render Diagnostic / Library / Studio flows.
- LLM classifier swap — design contract is ready; implementation is
  not.
- Versioning library entries — keywords are in, recipes aren't.
- Combo derivation at runtime — explicit data is fine for v1; auto-
  derive when we want to.

## Suggested next steps

1. Wire `prototype/diagnostic.html` to a tiny form: textarea, button,
   call `Chainwright.classify()`, render the top pattern + alternatives
   + the matched library tools.
2. Wire `prototype/library.html` to render `LIBRARY.tools` grouped by
   pattern, with the Pattern / Maturity / Primitive filter chips from
   the studio PDF.
3. Wire `prototype/index.html` (the Studio shell) to compose those two
   into the continuous flow.
4. After the GitHub Pages billing block clears, re-run the Pages
   workflow and verify all three render at `swixixle.github.io/Tool-Wizard/`.
