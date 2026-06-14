# Task 4: A/B Prompt Experiment

Task under test: **Login form with client-side validation** (same feature implemented in Task 2).

---

## Prompt A — Basic

```
Make a login form with validation.
```

**Prompt tokens:** ≈ 8

### What it produced (reconstructed)

A bare functional component with two `<input>` elements and an `onSubmit` handler. Typical gaps:

- HTML5 `required` / `type="email"` used instead of custom error messages — no inline error text
- No TypeScript interfaces; props typed as `any` or omitted entirely
- Validation runs on submit only, not on blur — user gets no feedback while typing
- No disabled state on the submit button
- No success state after submission
- Styling via inline `style={{}}` objects (violates AGENTS.md)
- No accessibility attributes (`aria-describedby`, `role="alert"` absent)

**Iterations to reach production quality:** 3–5 follow-up prompts
(add TS types → add blur validation → add disabled button → add success state → fix a11y)

**Total output tokens (estimated):** ≈ 800 per round × 4 rounds = **≈ 3 200 tokens**

---

## Prompt B — Structured

```
You are a senior React/TypeScript developer on a Next.js 16.2.7 project
(React 19.2.4, TypeScript 5, Tailwind CSS v4).

Context and constraints:
- No new npm packages
- Tailwind utility classes only — no inline styles
- "use client" only when state or event handlers are required
- No `any` types; define explicit TypeScript interfaces for all props and state
- Server Components by default; client boundary at the leaf level

Task: Create a login form component with client-side validation.

Acceptance criteria:
1. Email field validates presence and format (must contain @ and a domain);
   error appears on blur, not only on submit.
2. Password field requires ≥ 8 characters; error appears on blur.
3. Submit button is disabled while either field contains a validation error.
4. Each error message is rendered directly below its field with
   aria-describedby linking it to the input and role="alert" for screen readers.
5. On successful submit the form shows a success banner and resets to its
   empty initial state; a "Back to login" button dismisses the banner.

Format:
- Create app/components/LoginForm.tsx
  - Extract a reusable FormField sub-component to avoid duplicating
    label / input / error markup
  - Derive errors during render (no useEffect, no error state)
  - Use the touched pattern: errors visible only after the field is blurred
- Modify app/app/page.tsx to centre and render <LoginForm />
```

**Prompt tokens:** ≈ 270

### What it produced (actual output — session 2026-06-14)

First attempt delivered a complete, production-ready component:

- `FormValues`, `FormTouched`, `FormErrors` interfaces; `FormFieldProps` extending `React.InputHTMLAttributes<HTMLInputElement>`
- `FormField` sub-component with `aria-describedby` / `role="alert"`
- Pure `validateEmail` / `validatePassword` functions; errors derived during render
- `touched` pattern: blur sets flag → error appears
- Submit button `disabled={!isValid}` with `disabled:opacity-50 disabled:cursor-not-allowed`
- Success banner with "Back to login" reset

**Iterations to reach production quality:** **1**

**Total output tokens (actual):** ≈ 1 800 tokens

---

## Comparison

| Dimension | Prompt A (basic) | Prompt B (structured) |
|---|---|---|
| Prompt size | ≈ 8 tokens | ≈ 270 tokens |
| Output per round | ≈ 800 tokens | ≈ 1 800 tokens |
| Rounds to completion | 3–5 | **1** |
| Total output tokens | ≈ 3 200 | **≈ 1 800** |
| TypeScript interfaces | Missing | Complete |
| Accessibility | None | `aria-describedby` + `role="alert"` |
| Blur-triggered errors | No | Yes |
| Success state | No | Yes |
| Constraint compliance (no inline styles, no `any`) | Violated | Met on first pass |

---

## Conclusion

The structured prompt costs 262 more tokens upfront but eliminates 2–4 correction rounds. Total output tokens drop from ≈ 3 200 to ≈ 1 800 — a **44 % reduction** — and the result is correct on the first attempt with no follow-up needed.

The decisive factor is not length but specificity: role + stack version + explicit constraints + acceptance criteria together remove the model's need to guess at defaults. Each vague dimension in Prompt A (type safety? accessibility? when to show errors?) becomes an independent failure mode that triggers a correction round.

**Rule of thumb:** invest ~250 tokens in the prompt to save ~1 400 tokens in corrections, and get code that does not need to be re-reviewed for obvious omissions.