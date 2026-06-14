# Task 3: Context Cost Analysis

## Measurement

Tool: [repomix](https://github.com/yamadashy/repomix) — packs the repository into a single file that mirrors what an AI agent reads as context.

Command run from the project root:

```bash
npx repomix --output repomix-output.xml
```

Results (2026-06-15):

| Metric | Value |
|---|---|
| Files packed | 106 |
| Total tokens | 74 682 |
| Total characters | 294 789 |

> The `.claude/settings.json` deny list already excludes `node_modules/`, `.next/`, `dist/`, lock files, `.env*`, and `.git/`. Without those exclusions the token count would be orders of magnitude larger.

---

## Cost Calculation

Model used in this session: **Claude Sonnet 4.6** (`claude-sonnet-4-6`)

| Model | Input $/1M tokens | Output $/1M tokens |
|---|---|---|
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $1.00 | $5.00 |

### Per-request cost (full repo context as input)

Sending all 74 682 tokens on each request:

| Model | Input cost | Output cost (≈ 1 800 tokens) | Total |
|---|---|---|---|
| Sonnet 4.6 | 74 682 / 1 000 000 × $3.00 = **$0.224** | 1 800 / 1 000 000 × $15.00 = $0.027 | **≈ $0.25** |
| Haiku 4.5 | 74 682 / 1 000 000 × $1.00 = **$0.075** | 1 800 / 1 000 000 × $5.00 = $0.009 | **≈ $0.08** |

### Session estimate (Task 2 — login form, ≈ 10 agentic requests)

| Model | Cost per session |
|---|---|
| Sonnet 4.6 | 10 × $0.25 ≈ **$2.50** |
| Haiku 4.5 | 10 × $0.08 ≈ **$0.80** |

---

## Optimization Findings

### 1. Scope context to task-relevant files (saves ≈ 97 % on input)

The 106-file pack includes many files irrelevant to any single task: Next.js internal configs, unrelated pages, test fixtures, etc. For the login form task, the meaningful files are:

- `AGENTS.md` (project rules)
- `app/app/page.tsx` (entry point)
- `app/app/layout.tsx` (shell)
- `app/components/LoginForm.tsx` (main component)
- `app/tsconfig.json` (path aliases)

That is roughly **5–7 files ≈ 2 500 tokens**, not 71 986.

| Scenario | Input tokens | Input cost (Sonnet 4.6) |
|---|---|---|
| Full repo | 74 682 | $0.224 |
| Task-scoped | ≈ 2 500 | $0.008 |
| **Saving** | **−72 182** | **−$0.216 (97 %)** |

Use repomix's `--include` flag to pack only what is needed:

```bash
npx repomix --include "AGENTS.md,app/app/**,app/components/LoginForm.tsx,app/tsconfig.json" --output repomix-task.xml
```

---

### 2. Match model to task complexity (saves ≈ 67 % per step on simple tasks)

Not every step of an agentic session requires frontier reasoning. Reading a file, answering a factual question, or formatting output can be handled by a smaller model.

| Task type | Recommended model | Reason |
|---|---|---|
| Read files, list contents | Haiku 4.5 | No reasoning required |
| Simple formatting / boilerplate | Haiku 4.5 | Pattern matching |
| Planning, architecture decisions | Sonnet 4.6 | Needs reasoning |
| Complex TypeScript with generics | Sonnet 4.6 | Needs reasoning |

Switching to Haiku 4.5 for file-read and formatting steps while keeping Sonnet 4.6 for planning and implementation reduces the cost of each switched step by **67 %**; with simple steps making up the majority of a typical session, total session cost drops by roughly **50 %** without sacrificing output quality on the steps that matter.

---

### 3. Leverage prompt caching for stable context (saves up to 90 % on repeated tokens)

`AGENTS.md` and config files (`tsconfig.json`, `package.json`) do not change between requests. Anthropic's [prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) re-uses previously processed prefixes at **10 % of the normal input price**.

| Token type | Normal price (Sonnet 4.6) | Cached price |
|---|---|---|
| Cache write (first pass) | $3.75 / 1M | one-time |
| Cache read (subsequent) | $3.00 / 1M | $0.30 / 1M |

For a 10-request session where `AGENTS.md` (≈ 500 tokens) is sent every time:

- Without caching: 10 × 500 × $3.00 / 1M = $0.015
- With caching (1 write + 9 reads): $0.00188 + 9 × $0.00015 = **$0.003** — an 80 % saving on that slice of context.

---

## Summary

| Optimization | Saving | Effort |
|---|---|---|
| Scope context with `--include` | −97 % on input tokens | Low — one CLI flag |
| Use Haiku 4.5 for simple steps | −67 % on simple-step cost | Medium — route by task type |
| Prompt caching for stable files | −80–90 % on repeated stable tokens | Medium — add `cache_control` headers |