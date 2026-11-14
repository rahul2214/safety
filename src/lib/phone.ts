/**
 * Phone numbers for emergency contacts.
 *
 * An SOS is delivered by SMS and WhatsApp, and both need the country code: wa.me refuses a
 * bare 10-digit number, and an SMS to one is not reliably routed. So contacts are always
 * saved as +91XXXXXXXXXX. The API applies the same rule (InputGuard.NormalizeContactPhone);
 * this copy lets the form show and validate it before submitting.
 */
export const COUNTRY_CODE = '+91';

/** Digits of the national number as typed: strips a pasted +91 / 91 / leading 0. */
export function nationalDigits(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** An Indian mobile number is ten digits starting 6–9. */
export const isValidIndianMobile = (digits: string) => /^[6-9]\d{9}$/.test(digits);

/**
 * A number someone can be called on: any ten digits not starting with 0.
 *
 * Looser than isValidIndianMobile on purpose. A blood request is answered by a phone call, so
 * a hospital or blood-bank landline (STD code + number, e.g. 40 2345 6789) is a valid contact
 * even though it could never receive an SOS text.
 */
export const isCallableIndianNumber = (digits: string) => /^[1-9]\d{9}$/.test(digits);

/**
 * A number in the form a dialler, SMS app or wa.me link should receive.
 *
 * Contacts saved before the +91 rule are bare 10-digit numbers; they get the code here.
 * Anything already carrying a "+" is kept as it is.
 */
export function withCountryCode(phone: string): string {
  const trimmed = (phone ?? '').trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  if (trimmed.startsWith('+')) return `+${digits}`;
  if (isValidIndianMobile(digits)) return `${COUNTRY_CODE}${digits}`;
  if (digits.length === 11 && digits.startsWith('0') && isValidIndianMobile(digits.slice(1))) {
    return `${COUNTRY_CODE}${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith('91') && isValidIndianMobile(digits.slice(2))) {
    return `+${digits}`;
  }
  return digits;
}

/** "+919876543210" → "+91 98765 43210", for display. Other shapes are returned unchanged. */
export function formatPhone(phone: string): string {
  const full = withCountryCode(phone);
  const match = /^\+91(\d{5})(\d{5})$/.exec(full);
  return match ? `${COUNTRY_CODE} ${match[1]} ${match[2]}` : full || phone;
}
