import { Phone } from 'lucide-react';
import { siteData } from '../data.js';
import { InquiryForm } from '../components/InquiryForm';
import { PageIntro, TextLink } from '../components/Shared';

export function Inquiry() {
  const content = siteData.pages.inquiry;
  return <><PageIntro heading={content.heading} intro={content.intro} /><section className="container inquiry-layout"><InquiryForm /><aside className="inquiry-aside"><Phone size={24} aria-hidden="true" /><h2>{content.sideHeading}</h2><p>{content.sideText}</p><a className="contact-phone" href={siteData.business.phoneHref}>{siteData.business.phone}</a><hr /><h3>{siteData.business.hours.label}</h3><p>{siteData.business.hours.text}</p><TextLink href={siteData.actions.book.href}>{siteData.actions.book.label}</TextLink></aside></section></>;
}
