# Tool-Wizard — Guided Forge prototype

Interactive prototype of the **Guided Forge** mode of Tool-Wizard: the friction-pattern diagnostic that translates user chaos into ranked tool recommendations.

## Demos

- **`index.html`** — Studio: the unified Diagnostic → Library → Adapt → Preview flow. The canonical demo to show anyone.
- `diagnostic.html` — focused single-surface view of the 7-step Diagnostic flow.
- `library.html` — focused single-surface view of the searchable Library with partial-match handling.

## Real vs stub

**Real:** pattern recognition (keyword classifier — placeholder for the LLM version), library search and ranking, partial-match banner with gap analysis, score breakdown, adapt panel with primitive provenance markers, preview-before-confirm, novelty and confidence deltas.

**Stub:** actual tool generation. "Confirm Build" hits a placeholder card; the captured spec is what a real renderer would consume.

## Classifier contract

Both surfaces share a classifier interface that returns this shape:

```ts
interface ClassificationResult {
  pattern: FrictionPattern;             // one of 8 named patterns
  confidence: 'high' | 'med' | 'low';
  evidence: string[];                   // why this pattern was picked
  alternatives: FrictionPattern[];      // other patterns considered
  ranked_matches: ToolMatch[];          // sorted library hits
}

interface ToolMatch {
  tool: Tool;
  score: number;                        // 0–100
  matched_aspects: string[];
  missing_aspects: string[];
  gap_severity: 'minor' | 'moderate' | 'major';
}
```

Current implementation is the in-prototype keyword scorer. Production swap: an LLM classifier returning the same shape, with the keyword scorer kept as a fallback for graceful degradation when the LLM call fails or times out.

## Deferred

Search history, primitive-graph relationships ("frequently combined with X"), Quick Conjure mode, Alchemy Lab, real tool rendering. The prototype's footer flags where each lands.

## Editing

The HTML is single-file and dependency-free. Edit in place; no build step. To change the library data (the 24 tools), look for `const LIBRARY = [...]` near the top of the script blocks.
