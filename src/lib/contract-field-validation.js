/**
 * Client-side mirrors of the server-side edit-order validation rules.
 * Keep these patterns in sync with AdminOrderUpdate request rules:
 *   national/resident id : ^[12]\d{9}$
 *   Saudi mobile         : ^05\d{8}$
 *   commercial registry  : ^7\d{9}$
 */
export const CONTRACT_FIELD_PATTERNS = {
  saudi_id: {
    pattern: /^[12]\d{9}$/,
    message: "رقم الهوية يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2",
  },
  saudi_mobile: {
    pattern: /^05\d{8}$/,
    message: "رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05",
  },
  cr_number: {
    pattern: /^7\d{9}$/,
    message: "رقم السجل يجب أن يكون 10 أرقام ويبدأ بـ 7",
  },
  // Money amounts (Guarantee_amount / deposit / daily_fine / rent): server rule `numeric|min:0`.
  amount: {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: "يجب إدخال مبلغ رقمي صحيح (0 أو أكثر)",
  },
};

/**
 * Validate a single field value against its declared `validation` rule.
 * Empty values are left to the separate `required` check, so this only
 * validates non-empty input.
 *
 * @returns {string|null} error message, or null when valid / not applicable
 */
export function validateContractFieldValue(field, value) {
  const rule = field?.validation && CONTRACT_FIELD_PATTERNS[field.validation];
  if (!rule) return null;

  if (value == null) return null;
  const str = String(value).trim();
  if (str === "") return null;

  return rule.pattern.test(str) ? null : rule.message;
}

/**
 * Validate all fields that declare a `validation` rule.
 *
 * @returns {Record<string,string>} map of fieldKey -> error message
 */
export function validateContractFields(fields, form, isVisible = () => true) {
  const errors = {};
  for (const field of fields || []) {
    if (!field?.validation) continue;
    if (!isVisible(field, form)) continue;
    const error = validateContractFieldValue(field, form?.[field.key]);
    if (error) errors[field.key] = error;
  }
  return errors;
}
