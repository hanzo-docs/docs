import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'class-variance-authority';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
