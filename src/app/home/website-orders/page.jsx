"use client";

import { useUnwrapPageProps } from "@/src/hooks/use-unwrap-page-props";
import WebsiteOrdersWrapper from "@/components/website-orders/website-orders-wrapper";

export default function WebsiteOrdersPage(props) {
  useUnwrapPageProps(props?.params, props?.searchParams);

  return (
    <div className="flex flex-col gap-4 min-h-full" dir="rtl">
      <WebsiteOrdersWrapper />
    </div>
  );
}
