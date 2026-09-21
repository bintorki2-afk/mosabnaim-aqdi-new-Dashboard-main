"use client";

import { useUnwrapPageProps } from "@/src/hooks/use-unwrap-page-props";
import LeadsWrapper from "@/components/leads/leads-wrapper";

export default function LeadsPage(props) {
  useUnwrapPageProps(props?.params, props?.searchParams);

  return (
    <div className="flex flex-col gap-4 min-h-full" dir="rtl">
      <LeadsWrapper />
    </div>
  );
}
