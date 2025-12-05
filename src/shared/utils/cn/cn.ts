import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы в одну строку, оптимизирует Tailwind-классы.
 *
 * @param {...ClassValue[]} inputs - Список классов
 * @returns {string} Строка с объединёнными классами.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
