import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to Bangla-friendly string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('bn-BD', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(date)
}

// Convert minutes to readable duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} মিনিট`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} ঘণ্টা ${m} মিনিট` : `${h} ঘণ্টা`
}

// Calculate progress percentage
export function calcProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Slug generator
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}
