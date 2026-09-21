export function buildPaperworkFormData({ nameAr, nameEn, contractType, iconFile, deleteIcon = false }) {
  const formData = new FormData();
  formData.append("name_ar", nameAr);
  formData.append("name_en", nameEn);
  formData.append("contract_type", contractType);

  if (iconFile) {
    formData.append("icon", iconFile);
  }

  if (deleteIcon) {
    formData.append("delete_icon", "1");
  }

  return formData;
}

export function extractPaperwork(payload) {
  return payload?.data?.data ?? payload?.data ?? payload ?? null;
}
