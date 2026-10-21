import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { siteData } from '../data.js';
import { ActionPair } from './Shared';

export function HeroSlideshow() {
  const heroRef = useRef<HTMLElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const elapsedMs = useRef(0);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
  const slides = siteData.hero.slides;
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const temporarilyPaused = hovered || focused || !inView || !pageVisible;
  const autoEligible = !paused && !reducedMotion;
  useLayoutEffect(() => {
    if (!autoEligible || temporarilyPaused) return;
    let previousTime = performance.now();
    let frame: number;
    const tick = () => {
      const now = performance.now();
      elapsedMs.current += now - previousTime;
      previousTime = now;
      const progress = Math.min(elapsedMs.current / siteData.hero.intervalMs, 1);
      indicatorsRef.current?.style.setProperty('--slide-progress', String(progress));
      if (progress === 1) {
        elapsedMs.current = 0;
        indicatorsRef.current?.style.setProperty('--slide-progress', '0');
        setCurrent(value => (value + 1) % slides.length);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [autoEligible, temporarilyPaused, slides.length, current]);
  function selectSlide(index: number) { setPaused(true); setCurrent(index); }
  return <section ref={heroRef} className="hero" aria-label={siteData.hero.regionLabel} aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="hero-images">{slides.map((slide, index) => <img className={`hero-image ${index === current ? 'is-active' : ''}`} key={slide.id} src={slide.image.src} alt={slide.image.alt} aria-hidden={index !== current} width={slide.image.width} height={slide.image.height} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'low'} style={{ objectPosition: slide.image.focalPoint }} />)}</div><div className="hero-shade" />
    <div className="container hero-content"><h1>{siteData.hero.heading.map((line, index) => <span key={line} className={index === 2 ? 'hero-emphasis' : ''}>{line}</span>)}</h1><p>{siteData.hero.text}</p><ActionPair /></div>
    <div className="container hero-bottom"><span className="hero-location"><ArrowDown size={15} aria-hidden="true" />{siteData.hero.location}</span><div ref={indicatorsRef} className={`slide-indicators${autoEligible ? ' is-auto-advancing' : ''}${autoEligible && temporarilyPaused ? ' is-auto-paused' : ''}`} role="group" aria-label={siteData.hero.indicatorsLabel}>{slides.map((slide, index) => <button key={slide.id} className="slide-indicator" aria-label={slide.label} aria-pressed={index === current} onClick={() => selectSlide(index)}><span aria-hidden="true" /></button>)}</div></div>
  </section>;
}
