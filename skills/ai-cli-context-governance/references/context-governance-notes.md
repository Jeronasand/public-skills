# Context Governance Notes

## Problem Pattern

Long context windows are useful for occasional large-material lookup, but they should not become the default working memory for every CLI turn. If a CLI resends full history, full repo content, full logs, and all tool schemas each time, latency rises and the model becomes more likely to use stale or unsupported information.

## Three-Layer Model

### Hot Context

Always included. Keep it small, current, and structured:

- User goal.
- Current scope.
- Recent key facts.
- Current files or errors.
- Decisions.
- Pinned constraints.
- Next action.

### Warm Context

Retrieved on demand:

- Code snippets.
- Documentation chunks.
- Logs.
- Prior decisions.
- Issue comments.

Use BM25, vector search, filters, and reranking. Then deduplicate, cluster, compress, and pass only the best evidence.

### Cold Context

Stored but not sent by default:

- Full conversation history.
- Full repositories.
- Full logs.
- Complete knowledge base.
- Historical traces.

## Prompt Caching Friendly Shape

Keep stable content at the beginning:

```text
fixed rules
project rules
tool protocol
task summary
retrieved evidence
recent turns
latest request
```

Changing content should be late in the prompt.

## Evidence Block

Require source ids:

```text
Evidence:
[src/auth/session.ts:L40-L91]
[docs/auth-v2.md:Token Refresh]

Before answering:
- Check every claim against evidence.
- If evidence is missing, say unknown.
```

## Commands

### /compact

Create structured state:

- goal
- current_state
- confirmed_facts
- open_questions
- files_touched
- commands_run
- do_not_repeat
- next_steps

### /pin

Promote durable constraints:

- production database schema must not change
- current target file
- chosen architecture decision

### /forget

Remove context pollution:

- stale assumptions
- old design docs
- wrong API shape
- irrelevant turns

### /retrieve

Show used evidence chunks for debugging and trust.

## Triage Table

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Every turn is slow | Full history resent | Rolling summary plus retrieval |
| Old info appears | Stale chunks | Timestamp filters and dedupe |
| Fake files/functions | No evidence requirement | Evidence-only generation |
| Wrong files edited | Weak scope | Pin target and forbidden paths |
| Rate limit issues | Token budget too high | Budget gate and caching |
| Middle docs ignored | Lost-in-the-middle | Move critical evidence to beginning and near final request |
| Conversation drifts | Context pollution | Compact and forget |
