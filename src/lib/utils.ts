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