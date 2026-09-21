/**
 * Open a dialog from a Radix DropdownMenuItem safely.
 * Opening in the same tick as menu close often fails (focus restore race).
 */
export function openDialogAfterMenuClose(openFn, delayMs = 10) {
  if (typeof window === "undefined") {
    openFn?.();
    return;
  }
  window.setTimeout(() => {
    openFn?.();
  }, delayMs);
}
