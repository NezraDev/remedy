import { siteData } from '../data.js';

export type Service = Omit<(typeof siteData.services)[number], 'promotionEndDate' | 'bookingUrl'> & { promotionEndDate: string | null; bookingUrl: string | null };

export function isVisible(service: Service, now = new Date()) {
  if (service.publishStatus !== 'published') return false;
  if (!service.promotionEndDate) return true;
  const businessDate = new Intl.DateTimeFormat('en-CA', { timeZone: siteData.business.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return businessDate <= service.promotionEndDate;
}

export function formatPrice(service: Service) {
  if (service.priceAmountCents === 0 || service.priceAmountCents === null) return service.priceLabel;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency, maximumFractionDigits: 0 }).format(service.priceAmountCents / 100);
}

export function formatDuration(minutes: number | null) {
  if (minutes === null) return '';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours ? `${hours} hr` : '', rest ? `${rest} min` : ''].filter(Boolean).join(' ');
}

export function inquiryHref(id: string) {
  return `${siteData.actions.inquire.href}?service=${encodeURIComponent(id)}`;
}
