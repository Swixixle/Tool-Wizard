# Canon — Tool-Wizard / Chainwright

**One project, two faces.** This repo is the home of an integrated system
with two architectural roles that ship together:

- **Tool-Wizard** — the *conductor*. An orchestrator that warms a coding
  tool belt (Keysmith, repo-memory, IGNITION, GitHub MCP) for a specific
  project and returns a single dashboard. Surfaced in three form factors:
  v1 a Cowork chat skill, v2 a terminal CLI (`tw fire …`), v3 a Mac
  shortcut. v1 is drafted; v2 and v3 are not started.

- **Chainwright** — the *library / educational layer*. A consumer-facing
  catalog of ~24 recipe tools, each composed from a small set of
  recombinant primitives (Form, Aggregator, Dashboard, Tracker, Reminder
  Chain, Notes, Template, Scoring, Inbox/Checklist). Users land here
  first: describe a friction in plain language → diagnostic classifies it
  to one of 8 friction patterns → library surfaces matching recipes →
  user clones and remixes. The point is to teach tool-composition
  *grammar* by recognition, not by curriculum.

**They are one product.** Chainwright is the front door for non-engineers;
Tool-Wizard is the conductor that runs underneath when those users actually
build / run their adapted tools. The same primitive vocabulary spans both.

## Composition is shape-based, not monadic

Composition between primitives is governed by **uniform return contracts**
(every classifier returns `{ pattern, confidence, evidence, alternatives,
ranked_matches }`; every primitive declares its slots and connects to other
primitives by slot name). This is *interface-shaped* composition.

It is **not monadic** in the formal sense: there is no `bind`, no
return/unit, no laws stated or required. If we ever want monad semantics
for chaining diagnostic → library match → assembled tool, we'd need to
specify them; the design notes do not currently do so.

When the term "monadistic" comes up, the honest reading is: composition
is contract-uniform, which is the property that makes monads composable,
but we have not lifted the rest of the algebra.

## The eight friction patterns

These are the spine of Chainwright's diagnostic. Anchored in design
notes; the 9th (Versioning) is proposed but not yet in the library.

1. **Memory Failure** — "I forgot what I captured before"
2. **State Tracking** — "I don't know what stage this is in"
3. **Repetitive Language** — "I keep retyping the same intro emails"
4. **Comparison Overload** — "I have 40 PDFs and can't rank them"
5. **Don't-Know-Next** — "What's my first move tomorrow?"
6. **Scattered Attention** — "Where is everyone on my team?"
7. **Collecting From Others** — "How do I gather input without chaos?"
8. **Time-Sensitive Triggers** — "I need reminders that branch on outcomes"

Named recipe combos described in the PDFs: **The Pipeline, The Pulse,
The Drip, The Scorecard, The Ritual, The Reuse Kit**. These are the
"grammar" users learn by recognition.

## What this project is NOT

- Not a session manager (IGNITION owns sessions).
- Not a credential manager (Keysmith owns credentials).
- Not a generic prompt-engineering toolkit. The unit of value is *named
  friction patterns + recombinant primitives*, not prompt templates.
- Not an LLM wrapper. The classifier is currently keyword-based; an LLM
  classifier is a drop-in swap that preserves the same return shape.
- Not a course or curriculum. The library *is* the teaching surface.
