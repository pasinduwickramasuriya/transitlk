// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ FIXED: Proper utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function generateQRCode(): string {
  return Math.random().toString(36).substr(2, 9).toUpperCase()
}

export function calculateETA(distance: number, averageSpeed: number): number {
  return Math.round((distance / averageSpeed) * 60)
}

export function generateBookingReference(): string {
  return 'TLK-' + Date.now().toString(36).toUpperCase()
}
