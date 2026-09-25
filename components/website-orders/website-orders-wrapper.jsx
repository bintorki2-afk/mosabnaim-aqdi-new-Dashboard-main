"use client";

import { useMemo, useState } from "react";
import { Search, FileText, Inbox, Loader2, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebsiteOrders } from "@/src/hooks/use-website-orders";
import { formatSaudiMobileDisplay } from "@/src/lib/format-phone";

const STATUS_LABELS = {
  new: { label: "جديد", className: "bg-[#DBEAFE] text-[#1D4ED8] dark:bg-blue-500/20 dark:text-blue-300" },
  contacted: { label: "تم التواصل", className: "bg-[#FEF3C7] text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" },
  done: { label: "منتهٍ", className: "bg-[#DCFCE7] text-green-700 dark:bg-emerald-500/20 dark:text-emerald-300" },
};

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-surface-border-soft dark:border-white/10 bg-white dark:bg-[#0F1C16] px-4 py-3">
      <span
        className="size-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${tone}18`, color: tone }}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 dark:text-white/45 font-medium">{label}</p>
        <p className="text-lg font-black text-gray-900 dark:text-white tabular-nums">{value ?? 0}</p>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB");
}

function waHref(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return null;
  const intl = digits.startsWith("966")
    ? digits
    : digits.startsWith("0")
      ? `966${digits.slice(1)}`
      : digits;
  return `https://wa.me/${intl}`;
}

export default function WebsiteOrdersWrapper() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { summary, items, pagination, isLoading, isFetching, isError } = useWebsiteOrders({
    status,
    search,
    perPage,
    page,
  });

  const lastPage = pagination?.last_page ?? 1;

  const statusFilters = useMemo(
    () => [
      { value: "", label: "الكل" },
      { value: "new", label: "جديدة" },
      { value: "contacted", label: "تم التواصل" },
      { value: "done", label: "منتهية" },
    ],
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div className="flex flex-col gap-4 min-h-full" dir="rtl">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">طلبات الموقع</h1>
        <p className="text-13 text-gray-400 dark:text-white/45 mt-1">
          طلبات وصلت من الموقع (بدون تسجيل دخول) بانتظار التواصل عبر واتساب
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard icon={Inbox} label="الإجمالي" value={summary?.total} tone="#3B82F6" />
        <StatCard icon={FileText} label="جديدة" value={summary?.new} tone="#1D4ED8" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              onClick={() => {
                setPage(1);
                setStatus(f.value);
              }}
              className={cn(
                "h-8 px-3 rounded-full text-12 font-bold transition-colors",
                status === f.value
                  ? "bg-brand-dark text-white"
                  : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/70"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="size-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="بحث برقم الطلب أو الجوال"
            className="h-9 w-64 max-w-full pr-9 pl-3 rounded-xl border border-surface-border-soft dark:border-white/10 bg-white dark:bg-white/[0.04] text-13 focus:outline-none focus:border-brand-dark/40"
          />
        </form>
      </div>

      <div className="rounded-2xl border border-surface-border-soft dark:border-white/10 bg-white dark:bg-[#0F1C16] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-11 text-gray-400 dark:text-white/45 border-b border-surface-border-soft dark:border-white/10">
                <th className="px-4 py-3 font-bold">رقم الطلب</th>
                <th className="px-3 py-3 font-bold">نوع العقد</th>
                <th className="px-3 py-3 font-bold">واتساب</th>
                <th className="px-3 py-3 font-bold">الحالة</th>
                <th className="px-3 py-3 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    <Loader2 className="size-5 animate-spin inline" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-red-500 text-13">
                    تعذر تحميل طلبات الموقع
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-13">
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                items.map((order) => {
                  const st = STATUS_LABELS[order.status] ?? {
                    label: order.status || "—",
                    className: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70",
                  };
                  const wa = waHref(order.whatsapp_number);
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-surface-border-soft dark:border-white/5 last:border-0 hover:bg-[#F7FAF8] dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-13 font-bold text-brand-dark dark:text-emerald-300 tabular-nums">
                        {order.order_number || "—"}
                      </td>
                      <td className="px-3 py-3 text-13 font-medium text-gray-700 dark:text-white/70">
                        {order.contract_type || "—"}
                      </td>
                      <td className="px-3 py-3 text-13 font-medium text-gray-700 dark:text-white/70 tabular-nums" dir="ltr">
                        {wa ? (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-green-600 dark:text-emerald-300 hover:underline"
                          >
                            <MessageCircle className="size-3.5" />
                            {formatSaudiMobileDisplay(order.whatsapp_number) || order.whatsapp_number}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-10 font-bold", st.className)}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-12 text-gray-500 dark:text-white/50 tabular-nums whitespace-nowrap">
                        {formatDate(order.submitted_at || order.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {lastPage > 1 ? (
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-surface-border-soft dark:border-white/10">
            <span className="text-12 text-gray-400 dark:text-white/45">
              صفحة {pagination?.current_page ?? page} من {lastPage}
              {isFetching ? <Loader2 className="size-3.5 animate-spin inline ms-2" /> : null}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="size-8 rounded-lg border border-surface-border-soft dark:border-white/10 flex items-center justify-center disabled:opacity-40 hover:border-brand-dark/30"
                aria-label="السابق"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                disabled={page >= lastPage || isFetching}
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                className="size-8 rounded-lg border border-surface-border-soft dark:border-white/10 flex items-center justify-center disabled:opacity-40 hover:border-brand-dark/30"
                aria-label="التالي"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
