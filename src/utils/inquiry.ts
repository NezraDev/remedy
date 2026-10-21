import { siteData } from '../data.js';
import { isVisible } from './catalog';

export interface InquiryInput {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  contactMethod: string;
  message: string;
  preferredDateTime: string;
  consent: boolean;
  website: string;
  requestId: string;
}
export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

export const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

export function validLocalDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return year >= 2026 && year < 2100 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && hour < 24 && minute < 60;
}

export function validateInquiry(input: InquiryInput): FieldErrors {
  const errors: FieldErrors = {};
  const copy = siteData.inquiry;
  const nameHasControl = [...input.name].some(character => character.charCodeAt(0) < 32);
  if (input.name.trim().length < 2 || input.name.length > 100 || nameHasControl) errors.name = copy.invalidName;
  if (input.email.length > 254 || !emailPattern.test(input.email.trim())) errors.email = copy.invalidEmail;
  const digits = input.phone.replace(/\D/g, '');
  if ((input.contactMethod === 'phone' || input.phone) && (input.phone.length > 32 || digits.length < 7 || digits.length > 15 || !/^[+()\d\s.-]+$/.test(input.phone))) errors.phone = copy.invalidPhone;
  if (!['email', 'phone'].includes(input.contactMethod)) errors.contactMethod = copy.invalid;
  if (input.serviceId && !siteData.services.some(item => item.id === input.serviceId && isVisible(item))) errors.serviceId = copy.invalidService;
  const messageHasControl = [...input.message].some(character => character.charCodeAt(0) < 32 && !['\t', '\r', '\n'].includes(character));
  if (input.message.trim().length < 10 || input.message.length > 3000 || messageHasControl) errors.message = copy.invalidMessage;
  if (input.preferredDateTime && !validLocalDate(input.preferredDateTime)) errors.preferredDateTime = copy.invalidDate;
  if (!input.consent) errors.consent = copy.invalidConsent;
  return errors;
}
