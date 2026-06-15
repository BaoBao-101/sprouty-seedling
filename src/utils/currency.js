/**
 * formatVND — F-16 / CHUNK-15
 *
 * Formats a Vietnamese Dong (VND) amount according to locale conventions.
 * Uses the browser-native Intl.NumberFormat; no external library needed.
 *
 * Output examples:
 *   vi-VN → "150.000 ₫"
 *   en-US → "₫150,000"
 *   fr-FR → "150 000 ₫"
 *   ja-JP → "₫150,000"
 *
 * @param {number} amount  — raw VND integer (e.g. 150000)
 * @param {string} locale  — BCP-47 locale string (e.g. "vi-VN", "en-US")
 * @returns {string}
 */
export const formatVND = (amount, locale = "vi-VN") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
