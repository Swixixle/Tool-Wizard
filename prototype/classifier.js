// classifier.js — Chainwright keyword classifier v1
//
// CONTRACT (frozen — see canon.md / constraints.yaml):
//   classify(text) → {
//     pattern,           // string id of best-match pattern, or null
//     confidence,        // 0..1, share of total signal hitting top pattern
//     evidence,          // array of matched keywords/phrases for top pattern
//     alternatives,      // [{ pattern, confidence }] for runners-up
//     ranked_matches     // [{ tool_id, score }] from library, top pattern only
//   }
//
// This is keyword-based. Replacing it with an LLM classifier is a
// drop-in swap that MUST preserve this exact return shape — that's
// what protects the library and downstream UI from churning.
//
// Scoring rules:
//   - Multi-word phrases (kw with a space) score 2 per hit.
//   - Single tokens score 1 per hit, matched against tokenised input.
//   - Proposed patterns (e.g. versioning) are skipped by default.
//     Pass { includeProposed: true } as second arg to score them too.
//
// Depends on: window.PATTERNS, window.LIBRARY (loaded by patterns.js / library.js).

(function () {
  const MATURITY_RANK = { standard: 3, custom: 2, experimental: 1 };

  function tokenize(text) {
    return (text.toLowerCase().match(/[a-z']+/g) || []);
  }

  function scoreText(text, opts) {
    const t = text.toLowerCase();
    const tokens = tokenize(t);
    const tokenSet = new Set(tokens);
    const scores = {};
    const evidence = {};

    for (const p of window.PATTERNS) {
      if (p.proposed && !opts.includeProposed) continue;

      let score = 0;
      const hits = [];
      for (const kw of p.keywords) {
        const lower = kw.toLowerCase();
        if (lower.includes(' ')) {
          if (t.includes(lower)) {
            score += 2;
            hits.push(kw);
          }
        } else {
          if (tokenSet.has(lower)) {
            score += 1;
            hits.push(kw);
          }
        }
      }
      if (score > 0) {
        scores[p.id] = score;
        evidence[p.id] = hits;
      }
    }

    return { scores, evidence };
  }

  function rankMatches(patternId) {
    return window.LIBRARY.tools
      .filter(t => t.pattern === patternId)
      .map(t => ({
        tool_id: t.id,
        score: MATURITY_RANK[t.maturity] || 0
      }))
      .sort((a, b) => b.score - a.score);
  }

  function emptyResult() {
    return {
      pattern: null,
      confidence: 0,
      evidence: [],
      alternatives: [],
      ranked_matches: []
    };
  }

  function classify(text, opts) {
    opts = opts || {};
    if (!text || !text.trim()) return emptyResult();

    const { scores, evidence } = scoreText(text, opts);
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    if (sorted.length === 0) return emptyResult();

    const total = sorted.reduce((s, [, sc]) => s + sc, 0);
    const [topId, topScore] = sorted[0];
    const round = n => Math.round(n * 100) / 100;

    return {
      pattern: topId,
      confidence: round(topScore / total),
      evidence: evidence[topId],
      alternatives: sorted.slice(1).map(([id, sc]) => ({
        pattern: id,
        confidence: round(sc / total)
      })),
      ranked_matches: rankMatches(topId)
    };
  }

  // Tiny in-script test harness — surfaces obviously-wrong scoring on load.
  // Comment out the runSelfTest() call to silence in production.
  function runSelfTest() {
    const cases = [
      // [input, expected_pattern]
      ["I keep dropping balls with podcast guests — I forget who I promised what", "memory_failure"],
      ["I keep rewriting the same intro emails to potential clients", "repetitive_language"],
      ["Every Monday I waste two hours figuring out where everyone on my team is", "scattered_attention"],
      ["40 candidate PDFs and I don't know which to interview", "comparison_overload"],
      ["What's my first move tomorrow?", "dont_know_next"],
      ["Approval workflow with budget tracking for vendor purchases", "state_tracking"],
      ["Send a sequence of emails over 2 weeks", "time_sensitive_triggers"],
      ["I need to collect availability from 12 people", "collecting_from_others"]
    ];
    const results = cases.map(([input, expected]) => {
      const out = classify(input);
      return {
        input,
        expected,
        got: out.pattern,
        ok: out.pattern === expected,
        confidence: out.confidence,
        evidence: out.evidence
      };
    });
    const failed = results.filter(r => !r.ok);
    if (failed.length === 0) {
      console.log(`[chainwright/classifier] self-test ✓ (${results.length}/${results.length})`);
    } else {
      console.warn(`[chainwright/classifier] self-test FAILED (${failed.length}/${results.length})`, failed);
    }
    return results;
  }

  // Export to window for prototype consumption.
  window.Chainwright = window.Chainwright || {};
  window.Chainwright.classify = classify;
  window.Chainwright.runSelfTest = runSelfTest;
})();
