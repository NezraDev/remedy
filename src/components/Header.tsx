import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { siteData } from '../data.js';
import { Action } from './Shared';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === 'Escape' && open) { setOpen(false); trigger.current?.focus(); } }
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className={`site-header ${pathname === '/' ? 'header-home' : ''}`}>
    <a className="skip-link" href="#main-content">{siteData.actions.skip}</a>
    <div className="nav-row container">
      <Link className="brand" to="/" aria-label={siteData.branding.homeLabel}><img src={siteData.branding.logo} width="1080" height="692" alt={siteData.branding.logoAlt} /></Link>
      <nav className="desktop-nav" aria-label={siteData.footer.navigationLabel}>{siteData.navigation.map(item => <NavLink end={item.href === '/'} key={item.id} to={item.href}>{item.label}</NavLink>)}</nav>
      <div className="nav-actions"><Action href={siteData.actions.book.href}>{siteData.actions.book.label}</Action><ThemeToggle /><button className="icon-button menu-toggle" ref={trigger} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? siteData.actions.closeMenu : siteData.actions.menu}>{open ? <X size={24} /> : <Menu size={24} />}</button></div>
    </div>
    {open && <nav className="mobile-nav container" id="mobile-navigation" aria-label={siteData.footer.navigationLabel}>{siteData.navigation.map(item => <NavLink end={item.href === '/'} key={item.id} to={item.href} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></NavLink>)}<Link to={siteData.actions.inquire.href} onClick={() => setOpen(false)}>{siteData.actions.inquire.label}<ArrowUpRight size={18} aria-hidden="true" /></Link></nav>}
  </header>;
}
