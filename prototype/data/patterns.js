// patterns.js — Chainwright friction patterns v1
//
// Each pattern is a recognisable shape of "thing that keeps breaking."
// The 8 active patterns are anchored in the design PDFs.
// Versioning is a 9th, proposed-only sketch from the design notes —
// included so the keyword classifier can score it, but flagged
// `proposed: true` so the UI can hide it until it has library entries.
//
// Schema per pattern:
//   id          — snake_case stable id, used by classifier output and tools[].pattern
//   label       — human display name
//   emoji       — single-glyph icon used by Studio chips
//   tagline     — short user-voice line ("I keep losing the good version")
//   description — one paragraph for diagnostic detail panel
//   keywords    — array of strings; phrases (with spaces) score higher than single tokens
//   examples    — sample friction sentences this pattern should match
//   proposed    — true if not yet in the library (will be filtered out of active scoring by default)
//
// Plain global on window for prototype consumption (no build step).

window.PATTERNS = [
  {
    id: "memory_failure",
    label: "Memory Failure",
    emoji: "🧠",
    tagline: "I forgot what I captured before",
    description:
      "The user captures things — notes, ideas, promises, follow-ups — but the captures don't resurface when they need them. The breakage is between writing-down and finding-again. Solutions emphasise structured re-surfacing (recurring checklists, weekly resurfaces, capture inbox triage).",
    keywords: [
      "forgot", "forget", "forgetting", "remember", "remembered",
      "lost track", "lost the", "scattered", "all over the place",
      "where did i put", "where did i write", "i had it somewhere",
      "notes everywhere", "can't find", "cant find", "buried in",
      "wrote it down", "captured", "follow up", "follow-up",
      "drop the ball", "dropping balls", "dropped", "second brain",
      "i forget who", "promised what"
    ],
    examples: [
      "I keep dropping balls with podcast guests — I forget who I promised what",
      "I have notes everywhere and can't find anything",
      "I write things down but never look at them again",
      "I captured a great idea last month and have no idea where it went"
    ]
  },
  {
    id: "state_tracking",
    label: "State Tracking",
    emoji: "📊",
    tagline: "I don't know what stage this is in",
    description:
      "Things move through stages — leads, candidates, deals, projects — and the user can't tell at a glance where each thing is. The breakage is loss of pipeline visibility. Solutions are lightweight CRMs, pipelines, and promise engines that make stage explicit.",
    keywords: [
      "stage", "stages", "status", "track", "tracking", "tracked",
      "pipeline", "where in the process", "what stage", "progress",
      "in progress", "stalled", "owner", "who has", "who's doing",
      "last touched", "last contacted", "lifecycle", "next step",
      "approval workflow", "vendor", "purchases", "budget tracking",
      "promise", "commitment", "deal stage"
    ],
    examples: [
      "I have 30 deals and can't tell which ones are actually moving",
      "I lose track of where each candidate is in our hiring pipeline",
      "Approval workflow with budget tracking for vendor purchases",
      "Every commitment slips because I can't see them all"
    ]
  },
  {
    id: "repetitive_language",
    label: "Repetitive Language",
    emoji: "📝",
    tagline: "I keep retyping the same intro emails",
    description:
      "The same prose gets written over and over — intros, outros, pitches, status updates. The breakage is friction at the keyboard for content that should be canned. Solutions are snippet libraries, template packs, and adaptive engines that learn which variants land.",
    keywords: [
      "rewriting", "retyping", "retype", "rewrite", "same email",
      "same intro", "same opener", "same phrase", "same line",
      "copy paste", "copy-paste", "boilerplate", "template",
      "templates", "snippet", "snippets", "keep writing",
      "same thing again", "intro email", "outreach", "cold email",
      "merge field"
    ],
    examples: [
      "I keep rewriting the same intro emails to potential clients",
      "Every cold outreach starts with the same paragraph and I retype it",
      "I have four phrases I keep writing — there has to be a better way"
    ]
  },
  {
    id: "comparison_overload",
    label: "Comparison Overload",
    emoji: "⚖️",
    tagline: "I have 40 PDFs and can't rank them",
    description:
      "The user has many similar items and needs to compare them on stable criteria to make a decision. The breakage is decision paralysis from too-many-choices. Solutions are weighted rankers, scorecards, and document-Q&A piles that turn unstructured comparison into a structured grid.",
    keywords: [
      "rank", "ranking", "compare", "comparing", "comparison",
      "score", "scoring", "weigh", "weighted", "criteria",
      "candidates", "candidate", "pdfs", "applicants", "evaluate",
      "side by side", "side-by-side", "shortlist", "narrow down",
      "too many", "which one", "which to", "best of", "decision",
      "weighted criteria", "interview"
    ],
    examples: [
      "40 candidate PDFs and I don't know which to interview",
      "Six vendor proposals and I need to pick one — they all blur together",
      "Ranking next quarter's investments against the same criteria"
    ]
  },
  {
    id: "dont_know_next",
    label: "Don't-Know-Next",
    emoji: "🧭",
    tagline: "What's my first move tomorrow?",
    description:
      "The user has plenty to do but can't see what to start with. The breakage is morning paralysis or hand-off-from-yourself failure. Solutions are sticky-note next-actions, decision playbooks that always end on one card, and morning triage prompts.",
    keywords: [
      "what's next", "whats next", "what to do next", "next move",
      "next step", "first move", "first thing", "where to start",
      "stuck", "paralysis", "no idea what to do", "kickoff",
      "morning", "tomorrow", "log off", "first action",
      "triage", "what should i", "don't know where", "dont know where"
    ],
    examples: [
      "Every morning I waste an hour figuring out what to do first",
      "I close my laptop with no idea what tomorrow's first move is",
      "I'm staring at the inbox paralyzed about where to start"
    ]
  },
  {
    id: "scattered_attention",
    label: "Scattered Attention",
    emoji: "🌪",
    tagline: "Where is everyone on my team?",
    description:
      "Many people / many threads / many statuses, and the user has to assemble the picture by hand each time. The breakage is the cost of re-aggregating context. Solutions are async standup bots, weekly digests, and team pulse dashboards that pre-aggregate.",
    keywords: [
      "where is everyone", "where everyone", "where are we",
      "status update", "team status", "weekly status",
      "standup", "stand-up", "stand up", "digest", "weekly digest",
      "pulse", "team pulse", "dashboard", "scattered", "all over",
      "can't see at once", "overview", "monday", "weekly check-in",
      "across the team"
    ],
    examples: [
      "Every Monday I waste two hours figuring out where everyone on my team is",
      "I want one page that shows what each person on my team did this week",
      "Status updates land in five different threads and I can't see them at once"
    ]
  },
  {
    id: "collecting_from_others",
    label: "Collecting From Others",
    emoji: "📥",
    tagline: "How do I gather input without chaos?",
    description:
      "The user needs structured input from multiple people, and the inputs come back as a pile of formats — emails, DMs, voice memos, half-filled docs. The breakage is the assembly cost. Solutions are submission mailboxes, snowflake collectors with personalised forms, and shared sectioned docs.",
    keywords: [
      "collect", "collecting", "gather", "gathering", "submit",
      "submission", "submissions", "contributors", "contributions",
      "replies", "reply", "responses", "multiple people",
      "send around", "rsvp", "intake", "form", "everyone send",
      "everyone reply", "input from", "everyone fill in"
    ],
    examples: [
      "Sending out a quarterly survey and getting replies in four formats",
      "Each board member sends me their notes differently",
      "I need to collect availability from 12 people and Doodle isn't enough"
    ]
  },
  {
    id: "time_sensitive_triggers",
    label: "Time-Sensitive Triggers",
    emoji: "⏰",
    tagline: "I need reminders that branch on outcomes",
    description:
      "The user needs something to fire at a specific time, possibly conditional on what happened earlier. The breakage is forgetting to fire at all, or firing the wrong follow-up. Solutions go from a single alarm up to adaptive drips that branch on whether the recipient acted.",
    keywords: [
      "reminder", "reminders", "alarm", "alert", "drip",
      "schedule", "scheduled", "deadline", "follow up at",
      "follow-up at", "after x days", "after a week",
      "if no reply", "if they don't", "branching schedule",
      "trigger", "triggered", "ping me when",
      "sequence", "send a sequence", "sequence of emails",
      "weekly", "daily", "monthly", "every day", "every week",
      "set a timer", "timer", "over 2 weeks", "over a week"
    ],
    examples: [
      "Remind me to follow up if they don't reply in 3 days",
      "Send a sequence of emails over 2 weeks but skip later ones if they engage",
      "One reminder, one time — that's all I need"
    ]
  },
  {
    id: "versioning",
    label: "Versioning",
    emoji: "🌳",
    tagline: "I keep losing the good version of something I made before",
    description:
      "PROPOSED 9TH PATTERN (sketch only — not yet in the library). Distinct from Memory (capturing first-time thoughts) and State (progress through stages). This is about preserving past goodness — drafts, design iterations, 'wait, the one I had on Tuesday was actually better.'",
    keywords: [
      "version", "versions", "draft", "drafts", "iteration",
      "iterations", "old version", "previous version",
      "lost the good", "the one from", "revert", "undo",
      "earlier version", "rollback", "history", "snapshot"
    ],
    examples: [
      "I keep losing the good version of an essay I'm drafting",
      "Tuesday's design was better than today's and I can't find it",
      "I want to try a wild version without losing the safe version"
    ],
    proposed: true
  }
];
