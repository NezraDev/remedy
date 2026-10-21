import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { siteData } from '../data.js';
import { PageIntro, Action } from '../components/Shared';
import { ServiceCard } from '../components/ServiceCard';
import { isVisible } from '../utils/catalog';

export function Services() {
  const [params, setParams] = useSearchParams();
  const search = params.get('q') || '';
  const category = siteData.serviceCategories.some(item => item.id === params.get('category')) ? params.get('category')! : 'all';
  const content = siteData.pages.services;
  function update(key: string, value: string) { const next = new URLSearchParams(params); if (!value || value === 'all') next.delete(key); else next.set(key, value); setParams(next, { replace: true, preventScrollReset: true }); }
  const services = siteData.services.filter(item => isVisible(item)).filter(item => category === 'all' || item.categoryId === category).filter(item => `${item.displayName} ${item.publicDescription}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <><PageIntro heading={content.heading} intro={content.intro} /><section className="container catalog-section"><div className="catalog-toolbar"><div className="category-filters" role="group" aria-label={content.filterLabel}>{siteData.serviceCategories.map(item => <button className={item.id === category ? 'selected' : ''} key={item.id} aria-pressed={item.id === category} onClick={() => update('category', item.id)}>{item.name}</button>)}</div><div className="search-field"><Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor="service-search">{content.searchLabel}</label><input id="service-search" value={search} onChange={event => update('q', event.target.value)} placeholder={content.searchPlaceholder} />{search && <button className="icon-button" onClick={() => update('q', '')} aria-label={siteData.actions.clear}><X size={16} /></button>}</div></div><div className="catalog-note"><span aria-live="polite">{services.length} {content.resultsLabel}</span><p>{content.pricingNote}</p></div>{services.length ? <div className="services-grid">{services.map(service => <ServiceCard key={service.id} service={service} />)}</div> : <div className="empty-state"><Search size={36} aria-hidden="true" /><h2>{content.emptyHeading}</h2><p>{content.emptyText}</p><button className="button button-secondary" onClick={() => setParams({})}>{siteData.actions.clear}</button><Action href={siteData.actions.inquire.href}>{siteData.actions.inquire.label}</Action></div>}<p className="image-disclosure">{content.photoNote}</p></section></>;
}
