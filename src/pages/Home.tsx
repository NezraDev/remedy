import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteData } from '../data.js';
import { HeroSlideshow } from '../components/HeroSlideshow';
import { ServiceCard } from '../components/ServiceCard';
import { Action, Closing, Photo, TextLink } from '../components/Shared';
import { formatDuration, formatPrice, inquiryHref, isVisible } from '../utils/catalog';

export function Home() {
  const content = siteData.pages.home;
  const consultation = siteData.services.find(item => item.id === '11')!;
  return <><HeroSlideshow />
    <section className="section introduction"><div className="container introduction-grid"><h2>{content.introHeading}</h2><div><p className="lead-copy">{content.introText}</p><TextLink href={siteData.actions.about.href}>{siteData.actions.about.label}</TextLink><span className="small-note">{content.introNote}</span></div></div></section>
    <section className="section service-preview"><div className="container"><div className="section-heading"><div><h2>{content.servicesHeading}</h2><p>{content.servicesIntro}</p></div><TextLink href={siteData.actions.services.href}>{siteData.actions.services.label}</TextLink></div><div className="services-grid">{siteData.featuredServiceIds.map(id => siteData.services.find(item => item.id === id)).filter(item => !!item && isVisible(item)).map(service => service && <ServiceCard key={service.id} service={service} />)}</div><p className="image-disclosure">{siteData.pages.services.photoNote}</p></div></section>
    <section className="consultation-feature"><div className="consultation-photo"><Photo image={consultation.image} /></div><div className="consultation-content"><div><h2>{content.consultationHeading}</h2><p>{content.consultationText}</p><div className="consultation-price"><span>{formatPrice(consultation)}</span><span>{formatDuration(consultation.listedDurationMinutes)}</span></div><Action href={inquiryHref(consultation.id)}>{content.consultationLink}</Action></div></div></section>
    <section className="section approach"><div className="container approach-grid"><div><h2>{content.approachTitle}</h2><p>{content.approachText}</p></div><div className="approach-list">{content.approachItems.map(item => <div key={item.id}><ArrowUpRight size={20} aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div></div></section>
    <section className="category-links container">{siteData.serviceCategories.filter(item => ['skin', 'body', 'wellness'].includes(item.id)).map(category => <Link key={category.id} to={`/services?category=${category.id}`}><span>{category.name}</span><ArrowUpRight size={23} aria-hidden="true" /></Link>)}</section><Closing />
  </>;
}
