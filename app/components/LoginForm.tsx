'use client'

import { useState } from 'react'

interface FormValues  { email: string; password: string }
interface FormTouched { email: boolean; password: boolean }
interface FormErrors  { email: string; password: string }

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error: string
  showError: boolean
}

function FormField({ id, label, error, showError, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={showError ? `${id}-error` : undefined}
        aria-invalid={showError || undefined}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
        {...inputProps}
      />
      {showError && (
        <p id={`${id}-error`} className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

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

export default function LoginForm() {
  const [values,       setValues]       = useState<FormValues>({ email: '', password: '' })
  const [touched,      setTouched]      = useState<FormTouched>({ email: false, password: false })
  const [submitted,    setSubmitted]    = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)

  const errors: FormErrors = {
    email:    validateEmail(values.email),
    password: validatePassword(values.password),
  }
  const isValid = !errors.email && !errors.password

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(curr => ({ ...curr, [name]: value }))
    if (submitFailed) {
      const next = { ...values, [name]: value }
      if (!validateEmail(next.email) && !validatePassword(next.password)) {
        setSubmitFailed(false)
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(curr => ({ ...curr, [e.target.name]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      setTouched({ email: true, password: true })
      setSubmitFailed(true)
      return
    }
    setSubmitted(true)
    setValues({ email: '', password: '' })
    setTouched({ email: false, password: false })
  }

  return (
    <>
      {/* Pre-seeded live region so screen readers pick up the success announcement */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {submitted ? 'Logged in successfully!' : ''}
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-200 bg-green-50 px-10 py-8 text-center dark:border-green-800 dark:bg-green-950">
          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
            Logged in successfully!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="rounded-full border border-green-600 px-5 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-900"
          >
            Back to login
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-zinc-200 bg-white px-8 py-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Log in</h2>

          {submitFailed && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              Please fix the errors below before continuing.
            </p>
          )}

          <FormField
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            showError={touched.email && !!errors.email}
          />

          <FormField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            showError={touched.password && !!errors.password}
          />

          <button
            type="submit"
            disabled={!isValid}
            className="mt-1 rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log in
          </button>
        </form>
      )}
    </>
  )
}
