import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Returns `path` only when it is a safe same-app path, otherwise `fallback`.
 * Blocks open-redirect payloads: protocol-relative ("//evil.com"), backslash
 * tricks ("/\\evil.com") and control characters. Used for the ?from= back links.
 */
export function safeInternalPath(path, fallback) {
  return typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !/[\\\u0000-\u001f]/.test(path)
    ? path
    : fallback;
}
