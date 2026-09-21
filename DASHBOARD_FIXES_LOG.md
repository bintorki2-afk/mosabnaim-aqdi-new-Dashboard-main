# Dashboard Fixes Log — عقدي / Aqdi لوحة التحكم

Env: created `.env.local` with `NEXT_PUBLIC_BASE_URL=http://127.0.0.1:8000/api` (Firebase keys left blank, matching `.env.example`).
Build validated: `npm run build` compiles cleanly (the only build error in this sandbox is the Google-Fonts fetch for Tajawal, an offline/network limitation unrelated to the code — verified by a temporary local-font stub build that passed, then reverted). `npx tsc --noEmit` passes.

Design/markup preserved throughout — only logic, data binding, validation, safety dialogs, and new fields inside existing card patterns were changed.

---

## FIXED

### #1 — Order detail shows documentation fee instead of actual contract amount
- Files: `components/realtime-orders/details/map-order-detail.js`, `components/realtime-orders/details/order-groups/tenant-financial-group.jsx`
- How: `financial.rent` binds to `annual_rent_amount_for_the_unit` (with `contract_term_in_years.price` fallback); exposed the `total_price` money block (`doc_fee`, `doc_fee_vat_label`) and `amount_payment` separately; relabeled the paid-amount line from "رسوم الإيجار" to "رسوم التوثيق" so the rent ("إجمالي الإيجار") and the platform documentation fee are no longer conflated.
- Status: FIXED. (The all-orders list "الدفع" column intentionally shows `amount_payment` — that column is the payment, not the contract amount.)

### #2 — Contract duration always empty
- Files: `components/realtime-orders/details/map-order-detail.js`
- How: `durationLabel()` now reads `duration_years`/`duration_months` (step4 or top-level), then falls back to `contract_term_in_years` (relation `.period`/name or string), then `total_months`, then `duration_preset`.
- Status: FIXED.

### #3 — Individual tenant ID not shown
- Files: `map-order-detail.js`, `order-groups/tenant-financial-group.jsx`
- How: mapper adds `tenant.id_num` from `tenant_id_num`; rendered as "هوية المستأجر" for individual (person) tenants.
- Status: FIXED.

### #6 — Tenant "مؤسسة" (organization) data not shown
- Files: `map-order-detail.js`, `order-groups/tenant-financial-group.jsx`
- How: mapper adds `tenant.is_company`/`registry_number`/`region`/`city` from `tenant_entity`, `tenant_entity_unified_registry_number`, and `tenant_entity_region`/`tenant_entity_city` (relation objects / `relation_labels`). When tenant is a company, the tenant card shows unified registry number, region, and city.
- Status: FIXED.

### #16 — Deed number empty
- Files: `map-order-detail.js` (already binds `deed.number` to `instrument_number`; verified against `contract_summary.instrument_number` and top-level).
- Status: FIXED.

### #4/#5 — Owner name + owner-by-agency data not shown
- Files: `map-order-detail.js`, `order-groups/deed-address-group.jsx`
- How: mapper adds owner-by-agency fields (`id_num_of_property_owner_agent`, `mobile_of_property_owner_agent`, `agency_number_in_instrument_of_property_owner`, `agency_instrument_date_of_property_owner`, `copy_of_the_authorization_or_agency`) and `property_owner_is_deceased`; deed card renders `name_owner` plus a "بيانات الوكيل (بموجب وكالة)" block (id, phone, agency number/date, authorization doc link) and a "متوفى" indicator. Owner/agency fields are editable via the existing deed step editor (schema fields already present).
- Status: FIXED (display); agency fields editable through existing contract step editor.

### #33 — Special-path (waqf/deceased) documents: only one of three shown
- Files: `map-order-detail.js`, `order-groups/deed-address-group.jsx`
- How: added `buildSpecialDocs()` covering all six keys (`Image_inheritance_certificate`, `copy_power_of_attorney_from_heirs_to_agent`, `copy_of_the_endowment_registration_certificate`, `copy_of_the_trusteeship_deed`, `copy_of_guardians_power_of_attorney_for_agent`); every uploaded doc renders as its own "عرض" row under "مستندات إضافية".
- Status: FIXED.

### #10 — Edit-order modal accepts letters in ID / invalid phone
- Files: `src/lib/contract-field-validation.js` (new), `components/orders/single-order/contract-edit/contract-field-schemas.js`, `components/orders/single-order/contract-edit/contract-step-editor.jsx`
- How: added client-side patterns mirroring the server (`id ^[12]\d{9}$`, `mobile ^05\d{8}$`, `CR ^7\d{9}$`); tagged the id/mobile/registry fields with `validation:` and enforced them in `handleSave` before submit, with inline field errors + toast.
- Status: FIXED.

### #15 — Phone numbers drop the leading 0 (05) on display
- Files: `src/lib/format-phone.js` (new), `map-order-detail.js` (owner/agent/tenant phones), `components/leads/leads-wrapper.jsx`
- How: `formatSaudiMobileDisplay()` normalizes any shape (`5XXXXXXXX`, `966…`, `+966…`) back to canonical `05XXXXXXXX`; applied at detail-view and leads display points.
- Status: FIXED.

### #17 — Status change with no confirmation
- Files: `components/shared/confirm-dialog.jsx` (new), `components/realtime-orders/details/order-details-header.jsx`, `components/orders/change-status-dialog.jsx`
- How: added a reusable `ConfirmDialog` (built on the existing `alert-dialog` UI). The detail header status dropdown and the list's change-status dropdown now open a confirmation ("هل تريد تغيير حالة الطلب إلى …؟") before applying a plain status change. (Return-status and extra-fields flows keep their own dedicated dialogs.)
- Status: FIXED.

### #18 — Silent no-op buttons (add note / raise refund)
- Files: verified `order-details-header.jsx` → `use-order-details-dialogs.js` / `order-details-dialogs.jsx`; `components/employees/add-note-dialog.jsx`.
- How: verified both are wired — "إضافة ملاحظة" opens the comments panel (`comment-form`/`comment-list` via sidebar `displayedPart`) and, in the employees screen, `AddNoteForm` (real mutation); "رفع طلب استرجاع" calls `openReturn` → renders `ReturnRequestDialog`. No dead handlers found.
- Status: FIXED (verified wired end-to-end; no code change needed).

### #19 — Refund counters disagree with rows shown
- Files: `src/hooks/use-return-orders-wrapper.js`
- How: KPI counters previously came from a separate page-1 `summary.management_approval` endpoint while rows come from the full refund-contracts list. Now `kpiCounts` is derived from the same `refundContracts` dataset that builds `refundsLookup`/the row refund states, via `countReturnOrdersByApproval` — counters and rows share one source. Removed the divergent summary query.
- Status: FIXED.

### #21 — Units list has no progressive loading
- Files: `components/realtime-orders/details/order-groups/units-group.jsx`
- How: renders units in pages of 6 with a "عرض المزيد (N)" button, so a contract with many units doesn't mount every card up front.
- Status: FIXED.

### #36 — Lead/customer name stuck to source badge (RTL spacing)
- Files: `components/clients/clients-wrapper.jsx` (and applied correctly in the new leads view)
- How: the platform/blocked badges used `ml-2`, which in RTL puts the gap on the far side (name stuck to badge). Changed to logical `ms-2` so the gap sits between name and badge.
- Status: FIXED.

### #38 — Inflated performance score for inactive/off-duty employee (80/100 for 0 productivity)
- Files: `components/roles-and-employees/employee-perf-metrics.js`
- How: SLA percentages default to 100% when there is no data, which produced ~80/100 for an employee who received/processed/completed nothing. Added a `hasActivity` guard so the score is 0 when there is no activity. (The "27 late orders attributed to an off-duty employee" input is seed/demo data — see below.)
- Status: FIXED (score-calc bug); underlying late-count numbers are seed data.

### CR2 — "العملاء المحتملون" (potential customers) view
- Files: `src/hooks/use-leads.js` (new), `components/leads/leads-wrapper.jsx` (new), `src/app/home/leads/page.jsx` (new), `src/lib/permissions.js` (route rule + sidebar nav item)
- How: new gated route `/home/leads` fed by `GET /admin/leads?status=&search=&per_page=&page=`; renders summary cards (total/potential/paid), status filters, search, a table (name+source badge, phone via `formatSaudiMobileDisplay`, order link, amount, status, date), and pagination bound to the API `pagination` block.
- Status: FIXED.

### #40 — Marketing/content analytics panel empty / broken
- Files: `components/content/marketing/marketing-content-wrapper.jsx`
- How: added a persistent pre-launch/not-configured banner stating the analytics integrations (Google/Meta/pixels) are not connected and the displayed numbers are demo-only, so the panel is no longer presented as real, broken data.
- Status: FIXED (clear not-configured state; the underlying panels remain mock/demo pending integrations).

---

## SEED-DATA (no code bug; display kept robust — noted per instructions)

### #23 — Placeholder "hello"/"localhost" in guide/instructional content
- Searched the whole frontend and backend seeders: no "hello"/"localhost" placeholder strings exist in code. This content is runtime DB/guide content (paperworks/terms/message sections) entered during testing, not shipped in code. Nothing to change in the frontend; remove via the content editors / DB.
- Status: SEED-DATA.

### #34 — Employees/Salaries empty vs Metrics/Roles showing 6
- The counts come straight from the API/seed. The roles seeder defines 5 canonical roles; employee/salary emptiness vs role count is a data-population artifact, not a wiring bug. Displays already guard empties (no crash).
- Status: SEED-DATA.

### #37 — Roles: typo "موضف", near-duplicate roles, 0-permission roles
- The typo "موضف" is not present in the frontend or in `RoleSeeder.php` (which correctly uses "موظف"). Role names, duplicates, and 0-permission assignments are seed/DB-driven. Roles UI renders names from the API as-is.
- Status: SEED-DATA (fix in the DB/seed record; code renders correct names when data is correct).

### #38 (partial) / #39 — 27 late orders on off-duty employee; reports "cancelled 34 vs 1", fake "66ع", doubled revenue
- The score-inflation calc bug was fixed (see #38 above). The remaining numbers — late-order attribution, cancelled 34-vs-1, the "66ع" token, and any residual revenue figure — are seed/demo data; the backend already fixed the revenue double-count at source. Report/metric displays format defensively (guarded division, `?? 0`, no crashes).
- Status: SEED-DATA (for the data artifacts); revenue double-count fixed backend-side.

---

## New files
- `src/lib/format-phone.js`
- `src/lib/contract-field-validation.js`
- `components/shared/confirm-dialog.jsx`
- `src/hooks/use-leads.js`
- `components/leads/leads-wrapper.jsx`
- `src/app/home/leads/page.jsx`
- `.env.local`

---

## Production readiness

Pass focused on making the dashboard deployable, with no design changes (surgical only).

### ENV
- `.env.example` rewritten with every `NEXT_PUBLIC_*` the app reads plus the server-only
  `API_PROXY_TARGET`, each with a one-line comment and a placeholder/default value:
  `NEXT_PUBLIC_BASE_URL` (prod API base, points at `https://aqid.subcodeco.com/api`),
  `API_PROXY_TARGET` (rewrite target for `/api/*` — what the browser actually hits),
  the Firebase FCM group (`_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`,
  `_MESSAGING_SENDER_ID`, `_APP_ID`, `_MEASUREMENT_ID`, `_VAPID_KEY`) and
  `NEXT_PUBLIC_FIREBASE_DATABASE_URL`.
- Confirmed the API base is env-driven, not hardcoded: `src/utils/axios.js` →
  `getApiBaseUrl()` returns `${window.location.origin}/api` in the browser (same-origin,
  then rewritten server-side via `next.config.mjs` → `rewrites()` using
  `API_PROXY_TARGET`) and `process.env.NEXT_PUBLIC_BASE_URL` on the server. Firebase reads
  entirely from `process.env` in `src/lib/firebase/config.js`. No literal API host in the
  app code (the two occurrences of `aqid.subcodeco.com` are the documented defaults in
  `next.config.mjs` rewrites + image `remotePatterns`).

### CR2 — leads view (verified, no change needed)
- `src/hooks/use-leads.js` calls `GET /admin/leads` (baseURL already carries `/api`, so the
  effective request is `/api/admin/leads`) with `status`, `search`, `per_page`, `page`, and
  unwraps `{ summary:{total,potential,paid}, items:[...], pagination }` (tolerates an outer
  `data` envelope), defaulting summary/items/pagination safely.
- `components/leads/leads-wrapper.jsx` renders the documented item shape
  (`id, name, phone, contract_uuid, amount, status, created_at`, plus optional `source`)
  with: loading (spinner row), empty ("لا يوجد عملاء محتملون"), and error
  ("تعذر تحميل قائمة العملاء المحتملين") states; summary cards; status filters
  (potential/paid/all); debounced-submit search; phone normalized via
  `formatSaudiMobileDisplay`; order deep-link via `contract_uuid`; API-bound pagination.
- Reachable from the sidebar: `SIDEBAR_NAV` main group has `{ label:'العملاء المحتملون',
  href:'/home/leads' }` and `ROUTE_SECTION_RULES` gates `/home/leads` (section `null` =
  visible to any authenticated user), route at `src/app/home/leads/page.jsx`.

### Production config
- `vercel.json` added (framework `nextjs`, `buildCommand: npm run build`, install command,
  region `fra1`).
- `DEPLOY.md` added at repo root: full env-var table (what each is + where to get it),
  Vercel steps (import, build command, **Node 22**, env vars for Production/Preview),
  and a non-Vercel path (`npm run build && npm start`, plus the existing cPanel/Passenger
  `server.js` flow). Explicitly lists the owner-required values.

### QA / build
- `npm run build`: fails **only** on the offline Google-Fonts (Tajawal) fetch in
  `src/app/layout.js` — the known environmental limitation. Verified the rest of the app
  compiles cleanly by temporarily stubbing `next/font/google` to a local fallback: build
  reported "Compiled successfully", generated all 45 routes including `/home/leads`, then
  the stub was reverted (font import restored to `Tajawal(...)`).
- `npx tsc --noEmit`: passes (exit 0).
- Order-detail bindings from the prior pass re-verified present and referencing the
  documented API keys in `components/realtime-orders/details/map-order-detail.js`:
  actual amount (`annual_rent_amount_for_the_unit`, `total_price.*`, `amount_payment`),
  duration (`duration_years`/`contract_term_in_years`), tenant id (`tenant_id_num`),
  org (`tenant_entity`, `tenant_entity_unified_registry_number`, region/city),
  deed number (`instrument_number`), owner/agency
  (`id_num_of_property_owner_agent` and the agency block), and special docs
  (`buildSpecialDocs` covering `Image_inheritance_certificate` et al.). All compile.

### New/changed files (this pass)
- `.env.example` (rewritten), `vercel.json` (new), `DEPLOY.md` (new).
