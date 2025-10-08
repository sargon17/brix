import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});



export function normalizeObject<T extends Record<string, unknown> | undefined>(
  value: T
) {
  if (!value) {
    return undefined;
  }

  const filteredEntries = Object.entries(value).filter(
    ([, fieldValue]) =>
      fieldValue !== undefined &&
      fieldValue !== null &&
      fieldValue !== ""
  );

  if (filteredEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(filteredEntries) as NonNullable<T>;
}
