/**
 * Format a Saudi mobile number for display, always keeping the leading 05.
 *
 * The backend/API may return numbers in several shapes:
 *   "5XXXXXXXX"      (leading 0 dropped)
 *   "05XXXXXXXX"     (canonical local)
 *   "966XXXXXXXXX"   (international, no +)
 *   "+9665XXXXXXXX"  (international, with +)
 *   "009665XXXXXXXX" (international, 00 dial prefix — seed/legacy users table)
 * All of them are normalized back to the local "05XXXXXXXX" form for display.
 */
function saudiLocalDigits(value) {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  // International dial prefix "00966…" / "+966…" / "966…".
  if (digits.startsWith("00966")) digits = digits.slice(5);
  else if (digits.startsWith("966")) digits = digits.slice(3);

  // Local trunk zero "05…".
  if (digits.startsWith("0")) digits = digits.slice(1);

  return digits;
}

export function formatSaudiMobileDisplay(value) {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  const digits = saudiLocalDigits(raw);
  if (!digits) return raw;

  // Canonical Saudi mobile: 9 digits starting with 5 -> prefix the leading 0.
  if (digits.length === 9 && digits.startsWith("5")) {
    return `0${digits}`;
  }

  // Already in a local form with a leading 0 (and not an international shape).
  if (raw.startsWith("0") && !raw.startsWith("00")) return raw;

  // Unknown shape: keep the leading 0 if we have a plausible local number.
  return digits ? `0${digits}` : raw;
}

/**
 * Digits suitable for `https://wa.me/<digits>` / `tel:` — Saudi mobiles become
 * "9665XXXXXXXX"; anything else is returned as bare digits.
 */
export function toSaudiMobileDialDigits(value) {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  const digits = saudiLocalDigits(raw);
  if (digits.length === 9 && digits.startsWith("5")) {
    return `966${digits}`;
  }

  return raw.replace(/\D/g, "");
}
