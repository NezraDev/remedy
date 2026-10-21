import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { siteData } from './data.js';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { About, Contact, Faq, NotFound, Privacy, Results } from './pages/Information';
import { Booking } from './pages/Booking';
import { Inquiry } from './pages/Inquiry';
import { Chatbot } from './components/Chatbot';

function RouteEffects() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const routePath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const routes: Record<string, { title: string; description: string }> = siteData.seo.routes;
    const meta = routes[routePath] || routes['404'];
    document.title = meta.title;
    function setMeta(key: string, value: string, property = false) {
      const attr = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attr, key); document.head.appendChild(element); }
      element.content = value;
    }
    setMeta('description', meta.description);
    setMeta('og:title', meta.title, true); setMeta('og:description', meta.description, true);
    setMeta('og:type', 'website', true); setMeta('og:site_name', siteData.seo.siteName, true); setMeta('og:locale', siteData.seo.locale, true);
    setMeta('twitter:card', 'summary_large_image'); setMeta('twitter:title', meta.title); setMeta('twitter:description', meta.description);
    if (siteData.seo.siteUrl) {
      const url = new URL(routePath, siteData.seo.siteUrl).href;
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = url; setMeta('og:url', url, true);
      setMeta('og:image', new URL(siteData.seo.socialImage, siteData.seo.siteUrl).href, true);
      setMeta('twitter:image', new URL(siteData.seo.socialImage, siteData.seo.siteUrl).href);
    }
    setMeta('robots', routes[routePath] ? 'index, follow' : 'noindex, follow');
    if (previous.current !== pathname) { window.scrollTo(0, 0); document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true }); setAnnouncement(meta.title); }
    previous.current = pathname;
  }, [pathname]);
  return <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>;
}

export function App() {
  return <><RouteEffects /><Header /><main id="main-content" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/services" element={<Services />} /><Route path="/before-and-after" element={<Results />} /><Route path="/faq" element={<Faq />} /><Route path="/contact" element={<Contact />} /><Route path="/booking" element={<Booking />} /><Route path="/inquiry" element={<Inquiry />} /><Route path="/privacy" element={<Privacy />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><Chatbot /></>;
}
