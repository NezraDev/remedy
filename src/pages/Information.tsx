import { ArrowUpRight, Images, MapPin, Phone, Plus } from 'lucide-react';
import { siteData } from '../data.js';
import { Action, ActionPair, Closing, PageIntro, Photo, TextLink } from '../components/Shared';
import { BeforeAfterPair } from '../components/BeforeAfterPair';

export function About() {
  const content = siteData.pages.about;
  return <><PageIntro heading={content.heading} intro={content.intro} /><section className="container about-grid"><Photo image={content.image} eager /><div><h2>{siteData.business.name}</h2><p className="lead-copy">{content.body}</p><TextLink href={siteData.actions.services.href}>{siteData.actions.services.label}</TextLink></div></section><section className="container section about-second"><div><h2>{content.secondHeading}</h2><p>{content.secondText}</p><ActionPair /></div><Photo image={content.secondImage} /></section><Closing /></>;
}

export function Results() {
  const content = siteData.pages.results;
  const results = siteData.results.filter(item => item.publishStatus === 'published' && (item.combinedImage || (item.before && item.after)) && siteData.services.some(service => service.id === item.serviceId));
  return <><PageIntro heading={content.heading} intro={results.length ? content.approvedIntro : content.intro} /><section className="container results-section"><h2 className="results-subheading">{content.subheading}</h2>{results.length ? <>{results.map(result => <BeforeAfterPair key={result.id} result={result} />)}<div className="results-actions"><ActionPair /></div></> : <div className="empty-state results-empty"><Images size={40} strokeWidth={1} aria-hidden="true" /><h2>{content.emptyHeading}</h2><p>{content.emptyText}</p><ActionPair /><TextLink href={siteData.actions.services.href}>{siteData.actions.viewServices}</TextLink></div>}</section></>;
}

export function Faq() {
  const content = siteData.pages.faq;
  return <><PageIntro heading={content.heading} intro={content.intro} /><section className="container faq-section"><div className="faq-list">{siteData.faqs.map(faq => <details key={faq.id}><summary>{faq.question}<Plus size={20} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div><aside className="faq-aside"><h2>{content.ctaHeading}</h2><p>{content.ctaText}</p><Action href={siteData.actions.inquire.href}>{siteData.actions.inquire.label}</Action><a className="text-link" href={siteData.business.phoneHref}>{siteData.business.phone}<ArrowUpRight size={17} aria-hidden="true" /></a></aside></section></>;
}

export function Contact() {
  const content = siteData.pages.contact;
  return <><PageIntro heading={content.heading} intro={content.intro} /><section className="container contact-grid"><div className="contact-details"><div><Phone size={22} aria-hidden="true" /><h2>{content.phoneLabel}</h2><a className="contact-phone" href={siteData.business.phoneHref}>{siteData.business.phone}</a></div><div><MapPin size={22} aria-hidden="true" /><h2>{content.addressLabel}</h2><address>{siteData.business.address}<br />{siteData.business.cityStateZip}</address><a className="text-link" href={siteData.business.mapsUrl} target="_blank" rel="noreferrer">{siteData.actions.directions}<ArrowUpRight size={17} aria-hidden="true" /></a></div><div><h2>{siteData.business.hours.label}</h2><p>{siteData.business.hours.text}</p></div><ActionPair /></div><div className="contact-image"><Photo image={content.image} eager /><span>{siteData.business.locationLabel}</span></div></section></>;
}

export function Privacy() {
  const content = siteData.pages.privacy;
  return <><PageIntro heading={content.heading} intro={content.intro} /><article className="container privacy-copy">{siteData.privacy.sections.map(section => <section key={section.id}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<a className="text-link" href={siteData.business.phoneHref}>{siteData.actions.call} {siteData.business.phone}<ArrowUpRight size={17} aria-hidden="true" /></a></article></>;
}

export function NotFound() {
  const content = siteData.pages.notFound;
  return <div className="not-found container"><span>{content.code}</span><h1>{content.heading}</h1><p>{content.intro}</p><div className="action-pair"><Action href="/">{siteData.actions.backHome}</Action><Action href={siteData.actions.services.href} secondary>{siteData.actions.viewServices}</Action><Action href={siteData.actions.book.href} secondary>{siteData.actions.book.label}</Action></div></div>;
}
