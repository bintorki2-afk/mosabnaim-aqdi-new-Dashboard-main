"use client";

import { useMemo } from "react";
import { ContractStepEditor } from "./contract-edit/contract-step-editor";
import { getInstrumentTypeLabel } from "@/src/lib/instrument-types";
import { pickFirst } from "./frontend-contract-fields";

// Agent block only when the owner is represented by an agent (بوكالة).
const AGENT_VISIBLE = { add_legal_agent_of_owner: [1, "1", true] };

const DeedOwners = ({ data }) => {
  const summary = data?.contract_summary ?? {};
  const pick = (...keys) =>
    pickFirst(...keys.flatMap((key) => [summary?.[key], data?.[key]]));

  const instrumentTypeLabel = getInstrumentTypeLabel(
    pick("instrument_type_trans", "instrument_type", "instrument_type_key")
  );
  const deedNumber = pick("instrument_number", "deed_number");

  const fieldGroups = useMemo(
    () => [
      {
        title: "بيانات المستند",
        fields: [
          {
            key: "__deed_type_display",
            label: "نوع المستند",
            type: "text",
            locked: true,
            displayValue: instrumentTypeLabel,
          },
          {
            key: "__deed_number_display",
            label: "رقم الصك",
            type: "text",
            locked: true,
            displayValue: deedNumber,
          },
        ],
      },
      {
        title: "بيانات المالك",
        fields: [
          { key: "name_owner", label: "اسم المالك", type: "text" },
          // Same server-side format rules as UpdateContractRequest (#10).
          { key: "property_owner_id_num", label: "رقم الهوية", type: "text", validation: "saudi_id" },
          { key: "property_owner_mobile", label: "رقم الجوال", type: "text", validation: "saudi_mobile" },
          { key: "add_legal_agent_of_owner", label: "المالك بموجب وكالة", type: "boolean" },
        ],
      },
      {
        title: "بيانات الوكيل (بموجب وكالة)",
        fields: [
          {
            key: "id_num_of_property_owner_agent",
            label: "رقم هوية الوكيل",
            type: "text",
            validation: "saudi_id",
            showWhen: AGENT_VISIBLE,
          },
          {
            key: "mobile_of_property_owner_agent",
            label: "جوال الوكيل",
            type: "text",
            validation: "saudi_mobile",
            showWhen: AGENT_VISIBLE,
          },
          {
            key: "agency_number_in_instrument_of_property_owner",
            label: "رقم الوكالة",
            type: "text",
            showWhen: AGENT_VISIBLE,
          },
          {
            key: "agency_instrument_date_of_property_owner",
            label: "تاريخ الوكالة",
            type: "date",
            calendarTypeKey: "type_agency_instrument_date_of_property_owner",
            showWhen: AGENT_VISIBLE,
          },
          {
            key: "type_agency_instrument_date_of_property_owner",
            label: "نوع تاريخ الوكالة",
            type: "select",
            options: [
              { value: "hijri", label: "هجري" },
              { value: "gregorian", label: "ميلادي" },
            ],
            showWhen: AGENT_VISIBLE,
          },
          {
            key: "copy_of_the_authorization_or_agency",
            label: "صورة التفويض / الوكالة",
            type: "file",
            accept: "image/*,application/pdf",
            colSpan: 3,
            showWhen: AGENT_VISIBLE,
          },
        ],
      },
    ],
    [instrumentTypeLabel, deedNumber]
  );

  return (
    <div dir="rtl">
      <ContractStepEditor
        step="summary"
        fieldGroups={fieldGroups}
        startInEditing
        formOnly
      />
    </div>
  );
};

export default DeedOwners;
