import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteData } from '../data.js';
import type { ImageData } from '../types';

export function Photo({ image, className = '', eager = false }: { image: ImageData; className?: string; eager?: boolean }) {
  const smallWidth = image.smallWidth || Math.round(image.width * Math.min(800 / image.width, 800 / image.height));
  return <img className={className} src={image.src} srcSet={image.srcSmall ? `${image.srcSmall} ${smallWidth}w, ${image.src} ${image.width}w` : undefined} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 650px" alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} style={{ objectPosition: image.focalPoint }} />;
}

export function Action({ href, children, secondary = false, className = '', external = false }: { href: string; children: React.ReactNode; secondary?: boolean; className?: string; external?: boolean }) {
  const cls = `button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`;
  return external ? <a href={href} className={cls}>{children}<ArrowUpRight size={17} aria-hidden="true" /></a> : <Link to={href} className={cls}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="text-link" to={href}>{children}<ArrowRight size={18} aria-hidden="true" /></Link>;
}

export function ActionPair() {
  return <div className="action-pair"><Action href={siteData.actions.book.href}>{siteData.actions.book.label}</Action><Action href={siteData.actions.inquire.href} secondary>{siteData.actions.inquire.label}</Action></div>;
}

export function Closing() {
  const content = siteData.pages.closing;
  return <section className="closing section"><div className="container closing-inner"><h2>{content.heading}</h2><div><p>{content.text}</p><ActionPair /></div></div></section>;
}

export function PageIntro({ heading, intro, className = '' }: { heading: string; intro: string; className?: string }) {
  return <div className={`page-intro container ${className}`}><h1>{heading}</h1><p>{intro}</p></div>;
}
