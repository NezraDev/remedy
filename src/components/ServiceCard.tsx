import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteData } from '../data.js';
import { formatDuration, formatPrice, inquiryHref, type Service } from '../utils/catalog';
import { Photo } from './Shared';

export function ServiceCard({ service }: { service: Service }) {
  const category = siteData.serviceCategories.find(item => item.id === service.categoryId);
  return <article className="service-card" id={service.slug}>
    <Link className="service-image-link" to={inquiryHref(service.id)} aria-label={`${siteData.actions.browse}: ${service.displayName}`}><Photo image={service.image} />{'kind' in service.image && service.image.kind === 'illustration' && <span className="illustration-label">{siteData.pages.services.illustrationLabel}</span>}<span className="image-arrow"><ArrowUpRight size={22} aria-hidden="true" /></span></Link>
    <div className="service-card-content"><div className="service-meta"><span>{category?.name}</span><span><Clock3 size={13} aria-hidden="true" />{formatDuration(service.listedDurationMinutes)}</span></div><h3><Link to={inquiryHref(service.id)}>{service.displayName}</Link></h3><p>{service.publicDescription}</p><div className="service-card-bottom"><span className="service-price">{formatPrice(service)}</span><div><Link to={siteData.actions.book.href}>{siteData.actions.book.label}</Link><Link className="service-inquiry" to={inquiryHref(service.id)}>{siteData.actions.inquire.label}<ArrowUpRight size={14} aria-hidden="true" /></Link></div></div></div>
  </article>;
}
