import { clsx, type ClassValue } from "clsx";
import { isMatch, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCamel<T>(obj: Record<string, any>): T {
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result as T;
}

export function toSnake<T extends Record<string, any>>(
  obj: T,
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();

    result[snakeKey] =
      value && typeof value === "object" && !Array.isArray(value) ?
        toSnake(value)
      : value;
  }
  return result;
}

export function matchesFilter<T>(
  filter: T | T[] | null | undefined,
  value: T,
): boolean {
  if (filter == null) return true; // null or undefined
  if (Array.isArray(filter)) return filter.includes(value);
  return filter === value;
}

export function formatToUTCDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

export function fuzzyMatch(query: string, target: string): boolean {
  query = query.toLowerCase();
  target = target.toLowerCase();
  let i = 0;
  for (const char of target) {
    if (char === query[i]) i++;
    if (i === query.length) return true;
  }
  return false;
}

export const clearUTCTime = (date: Date) => {
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

export function safeParseDate(dateString: string | null, fallback: Date): Date {
  if (dateString === null || !isMatch(dateString, "yyyy-M-d")) return fallback;
  return parse(dateString, "yyyy-M-d", new Date());
}
