export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+\d{7,15}$/;

export const ROLES = ["Doctor", "Consultant", "Professor", "Medical Student"] as const;
export type Role = (typeof ROLES)[number];

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
