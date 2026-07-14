import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '');
  const truncated = digits.slice(0, 11);
  
  if (truncated.length <= 3) {
    return truncated;
  }
  if (truncated.length <= 6) {
    return `${truncated.slice(0, 3)}.${truncated.slice(3)}`;
  }
  if (truncated.length <= 9) {
    return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6)}`;
  }
  return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6, 9)}-${truncated.slice(9)}`;
}

export function formatCNPJ(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  let alphanumericPart = '';
  let numericPart = '';

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (alphanumericPart.length < 12) {
      alphanumericPart += char;
    } else if (numericPart.length < 2) {
      if (/[0-9]/.test(char)) {
        numericPart += char;
      }
    }
  }

  const combined = alphanumericPart + numericPart;
  
  if (combined.length <= 2) {
    return combined;
  }
  if (combined.length <= 5) {
    return `${combined.slice(0, 2)}.${combined.slice(2)}`;
  }
  if (combined.length <= 8) {
    return `${combined.slice(0, 2)}.${combined.slice(2, 5)}.${combined.slice(5)}`;
  }
  if (combined.length <= 12) {
    return `${combined.slice(0, 2)}.${combined.slice(2, 5)}.${combined.slice(5, 8)}/${combined.slice(8)}`;
  }
  return `${combined.slice(0, 2)}.${combined.slice(2, 5)}.${combined.slice(5, 8)}/${combined.slice(8, 12)}-${combined.slice(12, 14)}`;
}