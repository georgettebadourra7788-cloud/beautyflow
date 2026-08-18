// Fixed, translated set of services a salon can offer, replacing the old
// free-text Service field so a lead's service always renders fully in the
// active language instead of mixing English and Arabic on the same screen.
export const SERVICE_KEYS = [
  "haircut",
  "hair_color",
  "manicure",
  "pedicure",
  "facial",
  "massage",
  "waxing",
  "makeup",
  "other",
];

export function getServiceOptions(t) {
  return SERVICE_KEYS.map((key) => ({ value: key, label: t(`services.${key}`) }));
}

// Leads created before this change stored arbitrary free text (e.g. "Hair
// color") that won't match any of the keys above - fall back to showing
// that raw text as-is rather than a broken/untranslated lookup.
export function serviceLabel(t, service) {
  if (!service) return "";
  return SERVICE_KEYS.includes(service) ? t(`services.${service}`) : service;
}
