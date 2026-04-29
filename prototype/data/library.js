// library.js — Chainwright recipe library v1
//
// 24 tools across 8 friction patterns, plus 6 named primitive-combos
// and a primitive index. Anchored in chainwright-library.pdf and
// tool-wizard-design-notes.pdf.
//
// Tool schema:
//   id          — snake_case stable id
//   name        — display name
//   emoji       — pattern emoji (denormalised for fast render)
//   tagline     — one-line description from the library page
//   pattern     — pattern.id this tool maps to (single primary pattern)
//   maturity    — "standard" | "custom" | "experimental"
//   primitives  — array of primitive names this tool composes
//   combo       — optional combo.id this tool exemplifies
//   setup_min   — rough setup time in minutes (loose hint, not contract)
//
// Combo schema:
//   id, name, emoji, tagline, primitives, exemplar_tools (tool ids),
//   description (one paragraph)
//
// Plain global on window for prototype consumption.

window.LIBRARY = {
  primitives: [
    "Tracker",        // mutable rows with state
    "Reminder Chain", // time-based triggers, can branch
    "Notes",          // free-form text store
    "Form",           // structured input intake
    "Template",       // re-usable text/structure with merge fields
    "Aggregator",     // many → one summary
    "Dashboard",      // scannable overview surface
    "Scoring",        // weighted criteria → score
    "Compare View",   // side-by-side cells
    "Inbox/Checklist",// items to triage or tick
    "Snippet Library",// keyboard-trigger phrases
    "Usage Log"       // who used what when
  ],

  tools: [
    // 🧠 MEMORY FAILURE
    {
      id: "recurring_checklist",
      name: "Recurring Checklist",
      emoji: "🧠",
      tagline: "Same items, ticked off each time the situation comes up.",
      pattern: "memory_failure",
      maturity: "standard",
      primitives: ["Inbox/Checklist", "Reminder Chain"],
      combo: "the_ritual",
      setup_min: 5
    },
    {
      id: "second_brain",
      name: "Second Brain",
      emoji: "🧠",
      tagline: "Captures every note plus auto-generates weekly resurfaces and topical clusters.",
      pattern: "memory_failure",
      maturity: "custom",
      primitives: ["Notes", "Aggregator", "Reminder Chain"],
      setup_min: 30
    },
    {
      id: "capture_inbox",
      name: "Capture Inbox",
      emoji: "🧠",
      tagline: "One place to dump everything; review and route on a schedule.",
      pattern: "memory_failure",
      maturity: "standard",
      primitives: ["Inbox/Checklist", "Reminder Chain"],
      combo: "the_ritual",
      setup_min: 10
    },

    // 📊 STATE TRACKING
    {
      id: "lightweight_contact_tracker",
      name: "Lightweight Contact Tracker",
      emoji: "📊",
      tagline: "Plain CRM: contacts, last-touched date, free-form notes.",
      pattern: "state_tracking",
      maturity: "standard",
      primitives: ["Tracker", "Notes"],
      setup_min: 10
    },
    {
      id: "promise_engine",
      name: "Promise Engine",
      emoji: "📊",
      tagline: "Every commitment becomes a first-class object with its own state machine and audit trail.",
      pattern: "state_tracking",
      maturity: "custom",
      primitives: ["Tracker", "Reminder Chain", "Notes"],
      combo: "the_pipeline",
      setup_min: 45
    },
    {
      id: "podcast_guest_pipeline",
      name: "Podcast Guest Pipeline",
      emoji: "📊",
      tagline: "Tracks each guest from first ask to publish, with promise capture and follow-up triggers.",
      pattern: "state_tracking",
      maturity: "standard",
      primitives: ["Tracker", "Reminder Chain", "Notes"],
      combo: "the_pipeline",
      setup_min: 20
    },

    // 📝 REPETITIVE LANGUAGE
    {
      id: "email_snippets",
      name: "Email Snippets",
      emoji: "📝",
      tagline: "Keyboard-trigger snippets for the four phrases you keep retyping.",
      pattern: "repetitive_language",
      maturity: "standard",
      primitives: ["Snippet Library"],
      combo: "the_reuse_kit",
      setup_min: 3
    },
    {
      id: "adaptive_outreach_engine",
      name: "Adaptive Outreach Engine",
      emoji: "📝",
      tagline: "Templates with branching variants and a feedback loop that tracks which variants get replies.",
      pattern: "repetitive_language",
      maturity: "custom",
      primitives: ["Template", "Snippet Library", "Usage Log", "Reminder Chain"],
      combo: "the_reuse_kit",
      setup_min: 60
    },
    {
      id: "outreach_template_pack",
      name: "Outreach Template Pack",
      emoji: "📝",
      tagline: "Library of intro emails with merge fields, plus a usage log so you don't repeat the same opener at the same person.",
      pattern: "repetitive_language",
      maturity: "standard",
      primitives: ["Template", "Snippet Library", "Usage Log"],
      combo: "the_reuse_kit",
      setup_min: 15
    },

    // ⚖️ COMPARISON OVERLOAD
    {
      id: "multi_criteria_ranker",
      name: "Multi-criteria Ranker",
      emoji: "⚖️",
      tagline: "Generic weighted ranker not tied to a candidate domain.",
      pattern: "comparison_overload",
      maturity: "standard",
      primitives: ["Scoring", "Compare View"],
      combo: "the_scorecard",
      setup_min: 10
    },
    {
      id: "document_qa_pile",
      name: "Document Q&A Pile",
      emoji: "⚖️",
      tagline: "Ask the same questions of each PDF and collect the answers as columns.",
      pattern: "comparison_overload",
      maturity: "custom",
      primitives: ["Form", "Aggregator", "Compare View"],
      setup_min: 40
    },
    {
      id: "candidate_scorecard",
      name: "Candidate Scorecard",
      emoji: "⚖️",
      tagline: "A scorecard tied to each candidate with weighted criteria and side-by-side compare.",
      pattern: "comparison_overload",
      maturity: "standard",
      primitives: ["Tracker", "Scoring", "Compare View"],
      combo: "the_scorecard",
      setup_min: 20
    },

    // 🧭 DON'T-KNOW-NEXT
    {
      id: "next_action_sticky",
      name: "Next-Action Sticky",
      emoji: "🧭",
      tagline: "One Notes field. You write tomorrow's first move before you log off today.",
      pattern: "dont_know_next",
      maturity: "standard",
      primitives: ["Notes"],
      setup_min: 1
    },
    {
      id: "decision_playbook",
      name: "Decision Playbook",
      emoji: "🧭",
      tagline: "Branching prompts that always end on a single 'do this next' card.",
      pattern: "dont_know_next",
      maturity: "custom",
      primitives: ["Form", "Notes"],
      setup_min: 30
    },
    {
      id: "morning_triage_card",
      name: "Morning Triage Card",
      emoji: "🧭",
      tagline: "Daily 5-minute prompt that surfaces the top 3 next moves from your inbox.",
      pattern: "dont_know_next",
      maturity: "standard",
      primitives: ["Form", "Aggregator", "Dashboard"],
      combo: "the_pulse",
      setup_min: 15
    },

    // 🌪 SCATTERED ATTENTION
    {
      id: "weekly_digest_builder",
      name: "Weekly Digest Builder",
      emoji: "🌪",
      tagline: "You write the summary; the tool just structures it.",
      pattern: "scattered_attention",
      maturity: "standard",
      primitives: ["Template", "Notes"],
      setup_min: 10
    },
    {
      id: "async_standup_bot",
      name: "Async Standup Bot",
      emoji: "🌪",
      tagline: "Daily prompt to each person, replies collected into a single digest.",
      pattern: "scattered_attention",
      maturity: "standard",
      primitives: ["Form", "Aggregator", "Dashboard"],
      combo: "the_pulse",
      setup_min: 25
    },
    {
      id: "team_pulse_dashboard",
      name: "Team Pulse Dashboard",
      emoji: "🌪",
      tagline: "One page per team that aggregates each person's last weekly status into a scannable grid.",
      pattern: "scattered_attention",
      maturity: "standard",
      primitives: ["Form", "Aggregator", "Dashboard"],
      combo: "the_pulse",
      setup_min: 30
    },

    // 📥 COLLECTING FROM OTHERS
    {
      id: "shared_doc_with_sections",
      name: "Shared Doc with Sections",
      emoji: "📥",
      tagline: "One doc, one section per contributor, you nudge by hand.",
      pattern: "collecting_from_others",
      maturity: "standard",
      primitives: ["Notes"],
      setup_min: 5
    },
    {
      id: "snowflake_collector",
      name: "Snowflake Collector",
      emoji: "📥",
      tagline: "Each contributor gets a personalized form; replies feed a structured aggregator with charts and themes.",
      pattern: "collecting_from_others",
      maturity: "custom",
      primitives: ["Form", "Aggregator", "Dashboard"],
      combo: "the_pulse",
      setup_min: 60
    },
    {
      id: "submission_mailbox",
      name: "Submission Mailbox",
      emoji: "📥",
      tagline: "One link to send out; replies aggregate into a tracker with deadline countdown.",
      pattern: "collecting_from_others",
      maturity: "standard",
      primitives: ["Form", "Tracker", "Reminder Chain"],
      combo: "the_pipeline",
      setup_min: 20
    },

    // ⏰ TIME-SENSITIVE TRIGGERS
    {
      id: "single_alarm",
      name: "Single Alarm",
      emoji: "⏰",
      tagline: "One reminder at one time. Nothing else.",
      pattern: "time_sensitive_triggers",
      maturity: "standard",
      primitives: ["Reminder Chain"],
      setup_min: 1
    },
    {
      id: "adaptive_drip",
      name: "Adaptive Drip",
      emoji: "⏰",
      tagline: "Schedule branches based on whether the recipient acted on the previous step.",
      pattern: "time_sensitive_triggers",
      maturity: "custom",
      primitives: ["Reminder Chain", "Template", "Tracker"],
      combo: "the_drip",
      setup_min: 45
    },
    {
      id: "drip_schedule",
      name: "Drip Schedule",
      emoji: "⏰",
      tagline: "A sequence that releases events at fixed intervals from a start time.",
      pattern: "time_sensitive_triggers",
      maturity: "standard",
      primitives: ["Reminder Chain", "Template"],
      combo: "the_drip",
      setup_min: 15
    }
  ],

  combos: [
    {
      id: "the_pipeline",
      name: "The Pipeline",
      emoji: "🛤",
      tagline: "Ongoing relationships moving through stages, with active maintenance.",
      primitives: ["Tracker", "Reminder Chain", "Notes"],
      exemplar_tools: ["podcast_guest_pipeline", "promise_engine", "submission_mailbox"],
      description:
        "When you have a stream of relationships (guests, candidates, leads, submissions) that each move through the same stages and each demands periodic attention. The Tracker holds the rows, the Reminder Chain prods you, the Notes hold the unstructured context. If you find yourself wanting to add a Form to capture intake, you're moving toward The Pulse."
    },
    {
      id: "the_pulse",
      name: "The Pulse",
      emoji: "📊",
      tagline: "Many people contributing, one scannable surface.",
      primitives: ["Form", "Aggregator", "Dashboard"],
      exemplar_tools: ["team_pulse_dashboard", "morning_triage_card", "async_standup_bot", "snowflake_collector"],
      description:
        "When N people each contribute the same shape of input on a recurring cadence, and the value is in the aggregated view (not the individual replies). The Form structures input, the Aggregator merges, the Dashboard renders the summary. Add a Reminder Chain to nudge contributors and you have an Async Standup Bot."
    },
    {
      id: "the_drip",
      name: "The Drip",
      emoji: "⏰",
      tagline: "Time-released content, no inputs needed once set.",
      primitives: ["Reminder Chain", "Template"],
      exemplar_tools: ["drip_schedule", "adaptive_drip"],
      description:
        "When the work is in scheduling output, not collecting input. Templates hold the content, the Reminder Chain releases it on a cadence. Add Branching Rules + an Event Listener and the Drip becomes Adaptive (skip later steps when the recipient engages)."
    },
    {
      id: "the_scorecard",
      name: "The Scorecard",
      emoji: "⚖️",
      tagline: "Many things compared on stable, weighted criteria.",
      primitives: ["Tracker", "Scoring", "Compare View"],
      exemplar_tools: ["candidate_scorecard", "multi_criteria_ranker"],
      description:
        "When you face N items that need comparison on the same axes. The Tracker holds the items, Scoring assigns weighted scores, Compare View renders side-by-side. The simplest version (Multi-criteria Ranker) drops the Tracker and works directly off a list."
    },
    {
      id: "the_ritual",
      name: "The Ritual",
      emoji: "🔔",
      tagline: "A recurring touch point that resets each cycle.",
      primitives: ["Inbox/Checklist", "Reminder Chain"],
      exemplar_tools: ["recurring_checklist", "capture_inbox"],
      description:
        "When the value is in the regular reset — same items reviewed each Monday, same inbox emptied each Friday. The Inbox/Checklist holds the items, the Reminder Chain triggers the cycle. Powerful precisely because it's small."
    },
    {
      id: "the_reuse_kit",
      name: "The Reuse Kit",
      emoji: "📦",
      tagline: "Reusable language stored once, applied many times, optionally tracked.",
      primitives: ["Template", "Snippet Library", "Usage Log"],
      exemplar_tools: ["outreach_template_pack", "email_snippets", "adaptive_outreach_engine"],
      description:
        "When the same prose recurs and the cost is keyboard friction. Snippet Library covers the lightweight case (Email Snippets drops Template + Usage Log). Add a Usage Log so you don't reuse the same opener at the same person, and add Template merge-fields for personalisation."
    }
  ]
};
