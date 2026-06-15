/**
 * useFormatVND — convenience React hook for CHUNK-15
 *
 * Returns a memoised `formatVND(amount)` bound to the current i18n locale,
 * so callers don't have to thread the locale manually.
 *
 * Usage:
 *   const formatVND = useFormatVND();
 *   <span>{formatVND(150000)}</span>
 */
import { useTranslation } from "react-i18next";
import { localeFor } from "../i18n/index";
import { formatVND as _formatVND } from "../utils/currency";

export function useFormatVND() {
  const { i18n } = useTranslation();
  const locale = localeFor(i18n.language); // e.g. "vi-VN", "en-US"
  return (amount) => _formatVND(amount, locale);
}
