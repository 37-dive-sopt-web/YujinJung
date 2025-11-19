export function isValidEmail(email: string): boolean {
  if (email.length === 0) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function isPositiveInteger(text: string): boolean {
  if (text.length === 0) return false;
  const pattern = /^[1-9]\d*$/;
  return pattern.test(text);
}
