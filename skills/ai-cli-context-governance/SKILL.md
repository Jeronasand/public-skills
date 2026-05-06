---
name: ai-cli-context-governance
description: "Design, diagnose, or improve AI CLI long-context behavior with layered context, token budgets, evidence-driven generation, retrieval, compaction, pinning, forgetting, and prompt-caching friendly prompt structure. Use when Codex is asked to reduce AI CLI slowness, hallucinations, context pollution, lost-in-the-middle failures, or unstable answers caused by oversized prompts."
---

# AI CLI Context Governance

Use this skill when working on AI CLI context design, long-context performance, hallucination control, or context debugging.

## Core Rule

Do not treat very large context windows as working memory. Prefer:

```text
small hot context + precise retrieval + structured summary + evidence constraints + cache-friendly fixed prefix
```

## Context Layers

Use three layers:

1. Hot context: always included, small and structured.
   - Current user goal.
   - Recent key turns.
   - Current files, functions, stack traces, or commands.
   - Confirmed facts.
   - Explicit scope and forbidden changes.
   - Next step.

2. Warm context: retrieved on demand.
   - Code chunks, docs, logs, previous decisions, issue comments.
   - Retrieve with keyword search, vector search, filters, and reranking.
   - Deduplicate, cluster, rerank, and compress before sending to the model.

3. Cold context: stored, not directly sent.
   - Full conversation history.
   - Full repository.
   - Full logs.
   - Old agent traces.
   - Long-term knowledge base.

## Default Token Budget

Start with a conservative budget:

```yaml
context:
  max_total_tokens: 65536
  hot_context_tokens: 12000
  retrieved_context_tokens: 36000
  recent_turns_tokens: 8000
  summary_tokens: 4000
  reserve_output_tokens: 6000
retrieval:
  chunk_size_tokens: 800
  chunk_overlap_tokens: 120
  candidates_bm25: 50
  candidates_vector: 50
  rerank_top_k: 12
  final_top_k: 6
compression:
  trigger_tokens: 48000
  preserve_pinned: true
  preserve_sources: true
  summarize_old_turns: true
generation:
  require_evidence: true
  allow_unknown: true
  temperature: 0.1
  verify_before_final: true
```

Adjust only when the task truly requires larger context.

## Prompt Structure

Put stable content first to help prompt caching:

```text
[fixed system rules]
[project rules]
[tool protocol/schema]
[task summary]
[retrieved evidence]
[recent conversation]
[latest user request]
```

Keep tool schemas and examples minimal. Put long examples in retrieval storage instead of sending them every turn.

## Evidence-Driven Generation

Require an evidence block before answers:

```text
Evidence:
[file-a.ts:L10-L40] ...
[doc-12:section-auth] ...
[log-2026-05-06:L220-L260] ...

Instruction:
Only answer from Evidence. If evidence is missing, say unknown.
```

Every important claim should map to evidence. If there is no evidence, return uncertainty rather than inventing a confident answer.

## CLI Commands To Design

Implement these as user-facing or internal commands when building an AI CLI:

- `/compact`: summarize the session into structured state.
- `/pin`: promote important constraints, files, or decisions into hot context.
- `/forget`: remove stale assumptions, obsolete files, or polluted turns.
- `/retrieve`: show which chunks were used for the current answer.

## Compact Output Shape

Use structured state:

```json
{
  "goal": "",
  "current_state": "",
  "confirmed_facts": [],
  "open_questions": [],
  "files_touched": [],
  "commands_run": [],
  "do_not_repeat": [],
  "next_steps": []
}
```

## Diagnostic Checklist

- Slow every turn: check whether full history is resent; add rolling summary and retrieval.
- Uses stale facts: add timestamp/version filters and remove old chunks.
- Invents files/functions: require evidence-only answers.
- Edits wrong scope: pin current target and forbidden paths in hot context.
- Hits rate limits: reduce context, compact earlier, and stabilize prompt prefix.
- Ignores middle documents: move critical constraints to top and near final request.
- Conversation drifts: compact and forget polluted assumptions.

## References

Read `references/context-governance-notes.md` when you need a fuller checklist or implementation notes.
