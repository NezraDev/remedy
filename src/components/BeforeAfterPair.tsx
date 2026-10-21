import type { Result } from '../types';
import { siteData } from '../data.js';
import { inquiryHref } from '../utils/catalog';
import { Photo, TextLink } from './Shared';

export function BeforeAfterPair({ result }: { result: Result }) {
  const labels = siteData.pages.results;
  const service = siteData.services.find(item => item.id === result.serviceId);
  return <article className="result-pair"><h2>{result.title}</h2>{result.combinedImage ? <Photo image={result.combinedImage} /> : <div className="pair-images">{[{ label: labels.beforeLabel, image: result.before }, { label: labels.afterLabel, image: result.after }].map(item => item.image && <figure key={item.label}><Photo image={item.image} /><figcaption>{item.label}</figcaption></figure>)}</div>}<p>{result.description}</p><dl><div><dt>{labels.treatmentAreaLabel}</dt><dd>{result.treatmentArea}</dd></div>{result.sessionCount !== null && <div><dt>{labels.sessionsLabel}</dt><dd>{result.sessionCount}</dd></div>}{result.elapsedTimeLabel && <div><dt>{labels.timeLabel}</dt><dd>{result.elapsedTimeLabel}</dd></div>}</dl>{service && <TextLink href={inquiryHref(service.id)}>{service.displayName}</TextLink>}<p className="small-note">{labels.disclaimer}</p></article>;
}
