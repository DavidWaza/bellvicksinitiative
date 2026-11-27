/** "idemeto@gmail.com" → "id•••@gmail.com": for pages anyone holding the link could see. */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "";
  return `${user.slice(0, Math.min(2, user.length - 1))}•••@${domain}`;
}
