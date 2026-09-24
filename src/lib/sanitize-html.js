import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize untrusted HTML coming from the API (blog/CMS content, tenant-role
 * "service_definition") before it is rendered, to prevent stored XSS. DOMPurify
 * already strips <script> and on* handlers; the explicit lists below also drop
 * iframes, inline styles and srcdoc.
 */
export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html ?? "", {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["iframe", "script", "style", "form", "object", "embed"],
    FORBID_ATTR: ["style", "srcdoc", "onerror", "onload"],
  });
}
