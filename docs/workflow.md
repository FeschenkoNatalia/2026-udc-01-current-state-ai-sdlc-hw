# Task 2: Feature via Modes — Workflow

## Feature:

### Acceptance Criteria

1. **Email validation** — the email field rejects submission and shows an inline error when the value is empty or not a valid email address (must contain `@` and a domain).

2. **Password validation** — the password field rejects submission and shows an inline error when the value is fewer than 8 characters.

3. **Disabled submit** — the Submit button is disabled and non-clickable while either field contains a validation error or is empty; it becomes enabled only when both fields are valid.

4. **Error visibility** — each validation error message appears directly below its field immediately on blur (when the user leaves the field), not only on submit, so the user gets feedback without having to click Submit first.

5. **Successful submission** — when both fields pass validation and the user clicks Submit, the form displays a success message and resets to its empty initial state (no page reload required).

---

## Plan

**Files to create / modify:**

| File | Action |
|---|---|
| `app/components/LoginForm.tsx` | Create — the form component |
| `app/app/page.tsx` | Modify — render `<LoginForm />` on the home page |

---

**Step 1 — `LoginForm` component structure**

Create `app/components/LoginForm.tsx` as a `"use client"` component (needs state and event handlers).

State shape:
```ts
const [values, setValues]   = useState({ email: '', password: '' })
const [touched, setTouched] = useState({ email: false, password: false })
const [submitted, setSubmitted] = useState(false)
```

---

**Step 2 — Validation logic**

Pure helper functions (no side effects, easy to test):

```ts
function validateEmail(v: string): string {
  if (!v) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email'
  return ''
}

function validatePassword(v: string): string {
  if (!v) return 'Password is required'
  if (v.length < 8) return 'Password must be at least 8 characters'
  return ''
}
```

Derive errors during render (no extra state):
```ts
const errors = {
  email:    validateEmail(values.email),
  password: validatePassword(values.password),
}
const isValid = !errors.email && !errors.password
```

---

**Step 3 — Field behaviour**

- `onChange` — update `values`, keep `touched` unchanged (no premature errors while typing)
- `onBlur` — set the field's `touched` flag to `true`
- Show error only when `touched[field]` is `true`

---

**Step 4 — Submit button**

```tsx
<button type="submit" disabled={!isValid}>
  Log in
</button>
```

Disabled via the `disabled` attribute (not a CSS-only trick) so it is also non-interactive for keyboard and assistive technology.

---

**Step 5 — Form submission**

```ts
function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (!isValid) return
  setSubmitted(true)
  setValues({ email: '', password: '' })
  setTouched({ email: false, password: false })
}
```

Render a success banner when `submitted` is `true`; hide the form while the banner is shown.

---

**Step 6 — Styling**

Use Tailwind CSS v4 utility classes only (no inline styles, per `app/AGENTS.md`).
Error messages: `text-red-600 text-sm mt-1`.
Disabled button: `disabled:opacity-50 disabled:cursor-not-allowed`.

## Review

**Files to create / modify:**

| File | Action |
|---|---|
| `app/components/LoginForm.tsx` | Create — form + `FormField` sub-component |
| `app/app/page.tsx` | Modify — render `<LoginForm />` |

---

**Step 1 — Types**

```ts
interface FormValues  { email: string; password: string }
interface FormTouched { email: boolean; password: boolean }
interface FormErrors  { email: string; password: string }
```

---

**Step 2 — Validation (pure functions)**

```ts
const validateEmail = (v: string): string => {
  if (!v.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email'
  return ''
}
const validatePassword = (v: string): string => {
  if (!v) return 'Password is required'
  if (v.length < 8) return 'Must be at least 8 characters'
  return ''
}
```

Errors derived during render — no extra state, no `useEffect`.

---

**Step 3 — State**

```ts
const [values,    setValues]    = useState<FormValues>({ email: '', password: '' })
const [touched,   setTouched]   = useState<FormTouched>({ email: false, password: false })
const [submitted, setSubmitted] = useState(false)

const errors: FormErrors = {
  email:    validateEmail(values.email),
  password: validatePassword(values.password),
}
const isValid = !errors.email && !errors.password
```

---

**Step 4 — `FormField` sub-component** *(extracted to avoid duplication)*

```tsx
function FormField({ id, label, error, showError, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={showError ? `${id}-error` : undefined} {...inputProps} />
      {showError && (
        <p id={`${id}-error`} role="alert" className="text-red-600 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
```

`aria-describedby` links the input to its error for screen readers. `role="alert"` announces errors on blur.

---

**Step 5 — Field behaviour**

- `onChange` → update `values`; do not touch `touched` (no premature errors mid-typing)
- `onBlur` → mark field as touched → error appears

---

**Step 6 — Submit**

```ts
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!isValid) return
  setSubmitted(true)
  setValues({ email: '', password: '' })
  setTouched({ email: false, password: false })
}
```

Success banner rendered when `submitted === true` with a "Back to login" button that resets `submitted` to `false`.

---

**Step 7 — Styling rules**

- Tailwind v4 utilities only; no inline styles
- Disabled button: `disabled:opacity-50 disabled:cursor-not-allowed`
- Error text: `text-red-600 text-sm mt-1`
- `type="password"` on the password input

---

**Changes vs original plan:**

- Added explicit TypeScript interfaces (`FormValues`, `FormTouched`, `FormErrors`)
- Extracted `FormField` sub-component to remove duplicated label/input/error markup
- Added `aria-describedby` + `role="alert"` for accessibility
- Email validation now calls `.trim()` to reject whitespace-only input
- Success state includes a "Back to login" button instead of a one-way banner
- `type="password"` made explicit (was implied but not stated)

## Agent

Created `app/components/LoginForm.tsx` and updated `app/app/page.tsx` following the improved plan.

---

## How to Run

```bash
# from the project root
cd app
npm install      # first time only
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in a browser.

**Manual checklist against acceptance criteria:**

| # | What to do | Expected result |
|---|---|---|
| AC1 | Leave email blank, tab away | "Email is required" appears below the field |
| AC1 | Type `notanemail`, tab away | "Enter a valid email" appears |
| AC2 | Leave password blank, tab away | "Password is required" appears |
| AC2 | Type `abc`, tab away | "Must be at least 8 characters" appears |
| AC3 | Load the page fresh | Submit button is disabled |
| AC3 | Fill both fields correctly | Submit button becomes enabled |
| AC4 | Tab through fields without typing | Errors appear on blur, before Submit is clicked |
| AC5 | Submit a valid form | Success banner appears, form resets; click "Back to login" to return |