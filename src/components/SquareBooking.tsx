import { siteData } from '../data.js';
import { Action } from './Shared';

export function SquareBooking() {
  const content = siteData.booking;
  // Enable only a reviewed official booking-flow iframe URL obtained from Square.
  const allowedEmbed = content.embedUrl && /^https:\/\/([a-z0-9-]+\.)?(square\.site|squareup\.com)\//i.test(content.embedUrl);
  return <div className="square-booking"><h2>{content.heading}</h2><p>{content.instructions}</p><ol className="booking-steps">{content.steps.map(step => <li key={step.id}><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>{allowedEmbed && <iframe src={content.embedUrl!} title={content.embedTitle} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />}<Action href={content.url} external>{siteData.actions.square.label}</Action><p className="small-note">{content.fallback}</p></div>;
}
