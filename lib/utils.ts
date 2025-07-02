import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ur-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function convertUSDtoPKR(amountUSD: number): number {
  // Using a fixed conversion rate of 1 USD = 278 PKR (as of April 2024)
  const conversionRate = 278
  return Math.round(amountUSD * conversionRate)
}
