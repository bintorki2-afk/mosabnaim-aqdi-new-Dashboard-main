export const POPUP_CONTRACTS_QUERY_KEY = "popup-contracts";

export const POPUP_CONTRACTS_API = "/admin/popup-contracts";

export const POPUP_INSTRUMENT_TYPES = [
  { value: "electronic", label: "صك ملكيه الكتروني" },
  {
    value: "electronic_deed_from_the_ministry_of_justice",
    label: "صك ملكيه الكتروني من وزارة العدل والسجل العيني",
  },
  {
    value: "electronic_tax_register",
    label: "صك ملكيه الكتروني من السجل العقاري",
  },
  { value: "old_handwritten", label: "صك ملكيه ورقي" },
  {
    value: "property_ownership_owner_are_deceased",
    label: "صك ملكيه والمالك متوفي",
  },
  {
    value: "property_ownership_owner_are_deceased_endowment",
    label: "صك ملكيه ووقف ورثة متوفين",
  },
  {
    value: "property_ownership_owner_is_endowment",
    label: "صك ملكيه والمالك وقف",
  },
  {
    value: "property_ownership_owner_are_suspended",
    label: "صك ملكيه والمالك معلق",
  },
  { value: "sale_agreement", label: "ورقة مبايعه" },
  {
    value: "economic_cities_authority_suspended",
    label: "وثيقة هيئة المدن الاقتصاديه",
  },
  { value: "strong_argument", label: "حجة استحكام" },
  { value: "sublease_agreement", label: "عقد ايجار من الباطن" },
  { value: "lease_renewal", label: "تجديد عقد ايجار" },
];

const POPUP_INSTRUMENT_TYPE_LABELS = Object.fromEntries(
  POPUP_INSTRUMENT_TYPES.map((item) => [item.value, item.label])
);

export function getPopupInstrumentTypeLabel(type) {
  if (!type) return "—";
  return POPUP_INSTRUMENT_TYPE_LABELS[type] || type;
}

export function getPopupInstrumentTypeOptions() {
  return POPUP_INSTRUMENT_TYPES;
}

export function getAvailablePopupInstrumentTypeOptions({
  usedTypes = [],
  includeType = null,
} = {}) {
  const usedSet = new Set(
    usedTypes.filter((type) => type && type !== includeType)
  );

  return POPUP_INSTRUMENT_TYPES.filter((option) => !usedSet.has(option.value));
}

export function extractUsedPopupInstrumentTypes(items = []) {
  return items
    .map((item) => item?.instrument_type)
    .filter(Boolean);
}

export function formatPopupStatus(value) {
  return value ? "مفعل" : "غير مفعل";
}

export function stripHtmlContent(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasPopupContent(html = "") {
  return stripHtmlContent(html).length > 0;
}
