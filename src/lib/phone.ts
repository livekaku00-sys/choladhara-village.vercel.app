// Indian mobile numbers are stored as the plain 10 digits (e.g. 9876543210).
// People type them as "+91 98765 43210", "098765-43210" and so on.

/** The 10-digit mobile number, or null if the input is not a valid Indian mobile. */
export const normalizeIndianMobile = (input: string): string | null => {
  let digits = (input || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};

/** Best-effort 10 digits for numbers saved before validation existed. */
export const phoneDigits = (input: string) => normalizeIndianMobile(input) ?? (input || '').replace(/\D/g, '');

/** wa.me link for a stored number. */
export const whatsappLink = (phone: string, text: string) =>
  `https://wa.me/91${phoneDigits(phone)}?text=${encodeURIComponent(text)}`;
