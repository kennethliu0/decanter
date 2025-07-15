import { clsx, type ClassValue } from "clsx";
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
