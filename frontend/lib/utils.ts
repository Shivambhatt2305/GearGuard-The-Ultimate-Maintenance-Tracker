import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Deterministic date formatting to avoid hydration mismatches
export function formatDate(dateInput: string | number | Date, locale: string = 'en-US') {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Deterministic number formatting (no locale variance)
export function formatNumber(value: number, locale: string = 'en-US') {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value)
}
