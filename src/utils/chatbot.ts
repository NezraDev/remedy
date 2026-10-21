import { siteData } from '../data.js';
import { formatDuration, formatPrice, isVisible, type Service } from './catalog';

export type ChatAction = { label: string; href: string };
export type ChatReply = { text: string; actions?: ChatAction[] };
type Question = { id: string; question: string; answer: string; keywords: readonly string[] };

const contact: ChatAction = { label: 'Contact Remedy', href: siteData.business.phoneHref };
const booking: ChatAction = { label: 'View booking options', href: siteData.actions.book.href };
const servicesAction: ChatAction = { label: 'Browse services', href: siteData.actions.services.href };

// These answers deliberately refer unprovided business details to Remedy.
// This knowledge is internal to the assistant; it is never rendered as a question list.
export const additionalQuestions: Question[] = [
  { id: 'availability', question: 'Do you have appointments available today?', answer: 'Check Square for current appointment times. Please contact Remedy for same-day visits, walk-ins, waitlists, or group availability.', keywords: ['availability', 'available today', 'appointment today', 'same day', 'walk in', 'walk ins', 'waitlist', 'available tomorrow', 'available appointments', 'open slots'] },
  { id: 'reschedule', question: 'How can I change or cancel my appointment?', answer: 'Please contact Remedy to change or cancel an appointment and confirm any notice requirements or fees. This chat cannot modify a booking.', keywords: ['reschedule', 'cancel', 'cancellation', 'change my appointment', 'move my appointment', 'running late', 'late arrival', 'missed appointment', 'no show'] },
  { id: 'payment', question: 'What payment methods do you accept?', answer: 'Square handles any payment required during online booking. Please contact Remedy to confirm accepted payment methods, deposits, installments, financing, insurance, and any extra charges.', keywords: ['payment methods', 'pay with', 'credit card', 'debit card', 'cash', 'deposit', 'installments', 'financing', 'payment plan', 'insurance', 'extra charges', 'hidden fees', 'tax included', 'how can i pay'] },
  { id: 'refunds', question: 'Can I get a refund or transfer a package?', answer: 'Please contact Remedy to confirm refund, package transfer, expiration, and unused-session policies before purchasing.', keywords: ['refund', 'transfer my package', 'transfer a package', 'package expire', 'package expiration', 'unused sessions', 'package validity'] },
  { id: 'gifts', question: 'Can I buy a gift card?', answer: 'Please contact Remedy to ask about gift cards, gift purchases, and how a recipient can book.', keywords: ['gift card', 'gift certificate', 'gift voucher', 'buy a gift', 'gift for'] },
  { id: 'access', question: 'Is there parking and wheelchair access?', answer: 'Remedy is at 1221 N 77 Sunshine Strip, Harlingen, TX 78550. Please contact Remedy to confirm parking, wheelchair access, and any assistance you need for your visit.', keywords: ['parking', 'wheelchair', 'accessible', 'accessibility', 'step free', 'elevator'] },
  { id: 'languages', question: 'Do you speak Spanish?', answer: 'Please contact Remedy to confirm staff language availability and arrange any help you need for your visit.', keywords: ['spanish', 'espanol', 'hablan', 'language', 'interpreter'] },
  { id: 'age-consent', question: 'Is there a minimum age for treatment?', answer: 'Please contact Remedy to confirm age requirements, parental consent, and which services are available for minors. Teen camp is listed at 55 minutes with variable pricing.', keywords: ['minimum age', 'age requirement', 'parental consent', 'under 18', 'children', 'child treatment', 'minor', 'teenager'] },
  { id: 'preparation', question: 'How should I prepare for treatment?', answer: 'Please contact Remedy for preparation instructions for your specific service, including what to wear or bring, food or drink guidance, and any aftercare.', keywords: ['prepare', 'preparation', 'before treatment', 'before my appointment', 'what to wear', 'what should i wear', 'what to bring', 'what should i bring', 'aftercare', 'after care', 'drink water', 'eat before'] },
  { id: 'safety', question: 'Is a treatment suitable for my health condition?', answer: 'Please contact Remedy to discuss treatment-specific suitability, contraindications, and any health concerns with the appropriate professional. This assistant cannot assess medical eligibility.', keywords: ['pregnant', 'pregnancy', 'breastfeeding', 'pacemaker', 'diabetes', 'health condition', 'medical condition', 'contraindication', 'contraindications', 'medication', 'safe', 'risks', 'side effects', 'surgery', 'implants'] },
  { id: 'comfort', question: 'Does treatment hurt and is there downtime?', answer: 'Please contact Remedy about comfort, recovery time, and what to expect for your chosen service. Experiences and aftercare depend on the treatment and the individual.', keywords: ['pain', 'painful', 'hurt', 'downtime', 'recovery', 'bruising', 'swelling', 'burning', 'return to work', 'discomfort'] },
  { id: 'frequency', question: 'How many sessions will I need?', answer: 'The menu lists both single appointments and packages. Please contact Remedy for a recommendation on session count, spacing, and a plan for your goals.', keywords: ['how many sessions', 'how often', 'sessions do i need', 'how many treatments', 'between sessions', 'session spacing', 'treatment frequency', 'every week'] },
  { id: 'outcomes', question: 'When will I see results and how long do they last?', answer: 'Individual experiences vary and no particular outcome is promised. Please contact Remedy to discuss expected timing, maintenance, and realistic goals for the service you are considering.', keywords: ['when will i see', 'see results', 'results last', 'permanent results', 'permanent', 'lose weight', 'lose inches', 'how fast', 'maintenance', 'guaranteed', 'guarantee'] },
  { id: 'groups', question: 'Can I book a group or body contouring party?', answer: 'The Body Contouring Party listing covers four people for $925 with a listed three-hour appointment. The supplied menu lists an additional $175 for a fifth person. Please contact Remedy to confirm the group size, requested date, current price, and treatments included.', keywords: ['group booking', 'group appointment', 'party', 'four people', '4 people', 'fifth person', '5 people', 'bring friends'] },
  { id: 'promotions', question: 'Do you have discounts or special offers?', answer: 'Browse the current service listings and Square for prices and listed offers. Please contact Remedy to confirm any promotion, discount, eligibility, or offer end date.', keywords: ['discount', 'coupon', 'promo code', 'special offers', 'specials', 'promotion', 'deals'] },
  { id: 'companions', question: 'Can I bring a child or a guest?', answer: 'Please contact Remedy to confirm guest and child attendance policies. Childcare availability has not been provided.', keywords: ['childcare', 'child care', 'bring a child', 'bring my child', 'bring my kids', 'bring a guest', 'bring someone', 'bring my baby', 'companion'] },
  { id: 'details', question: 'What equipment or products do you use?', answer: 'The menu identifies treatment types, but specific equipment models, product ingredients, and allergy information have not been provided. Please contact Remedy to confirm the details for your service.', keywords: ['equipment model', 'machine brand', 'what machine', 'ingredients', 'allergy', 'allergies', 'products do you use', 'licensed', 'qualifications'] },
  { id: 'contact-channels', question: 'Can I text or email Remedy?', answer: `The provided contact number is ${siteData.business.phone}. Please contact Remedy there to confirm texting, email, social media, or other contact options.`, keywords: ['text you', 'text remedy', 'email', 'whatsapp', 'instagram', 'facebook', 'social media', 'speak to someone', 'human', 'real person', 'representative'] },
];

export function normalizeQuestion(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/([a-z])['’]s\b/g, '$1 is').replace(/[^a-z0-9]+/g, ' ').trim();
}

function includesPhrase(query: string, phrase: string) {
  return (` ${query} `).includes(` ${normalizeQuestion(phrase)} `);
}

const serviceAliases: Record<string, string[]> = {
  '01': ['microdax', 'micro dax'], '02': ['remface', 'rem face', 'facial muscle treatment'],
  '04': ['flex sculpt', 'flexsculpt'], '05': ['flex sculpt', 'flexsculpt'], '06': ['pemf', 'pemf bed'],
  '07': ['plasma pen'], '08': ['plasma pen'], '12': ['double chin'],
  '13': ['curve enhancement laser lipo'], '14': ['jade laser', 'jade laser lipo'],
  '03': ['911'], '23': ['911'],
  '17': ['diamond membership', 'membership', 'infrared sauna', 'pressotherapy', 'lymphatic treatments', 'lymphatic drainage', 'led therapy', 'velashape', 'vela shape', 'ems'], '18': ['emsella', 'pelvic chair', 'pelvic floor'],
  '19': ['body contouring party'], '20': ['v shape', 'vshape', 'v shape sessions'],
  '21': ['emsella', 'pelvic chair', 'pelvic floor'], '22': ['muscle sculpting', 'emsculpt', 'ems sculpt'],
  '24': ['cavitation training', 'rf training', 'certification'],
  '25': ['laser lipo', 'laserlipo', 'cavilipo', 'cavitation', 'ultrasonic cavitation'],
  '26': ['cavilipo rf', 'cavilipo package', 'radio frequency', 'radiofrequency'],
};

function findServices(query: string): Service[] {
  const services = (siteData.services as Service[]).filter(service => isVisible(service));
  const matches = services.map(service => {
    const names = [service.displayName, service.sourceName, service.slug.replaceAll('-', ' '), ...(serviceAliases[service.id] ?? [])];
    const lengths = names.filter(name => includesPhrase(query, name)).map(name => normalizeQuestion(name).length);
    return { service, score: Math.max(0, ...lengths) };
  });
  const best = Math.max(0, ...matches.map(match => match.score));
  return best ? matches.filter(match => match.score === best).map(match => match.service) : [];
}

function serviceReply(services: Service[]): ChatReply {
  return {
    text: services.map(service => `${service.displayName} — ${formatPrice(service)} · ${formatDuration(service.listedDurationMinutes)}. ${service.publicDescription}`).join('\n\n'),
    actions: [services.length > 1 ? servicesAction : booking, contact],
  };
}

function replyForQuestion(item: Question): ChatReply {
  const actions: ChatAction[] = [];
  if (['service-catalog', 'service-price', 'pricing', 'free-services', 'membership', 'double-chin-offer', 'training', 'promotions'].includes(item.id)) actions.push(servicesAction);
  if (['book', 'first', 'inquiry', 'availability', 'rebook'].includes(item.id)) actions.push(booking);
  if (item.id === 'location') actions.push({ label: 'Get directions', href: siteData.business.mapsUrl });
  if (item.id === 'before-after') actions.push({ label: 'View gallery', href: '/before-and-after' });
  if (/contact remedy|call|confirm|ask remedy/i.test(item.answer) || !actions.length && item.id !== 'privacy') actions.push(contact);
  return { text: item.answer, actions };
}

export function answerQuestion(query: string, previousQuestion?: string): ChatReply {
  const normalized = normalizeQuestion(query);
  const questions: Question[] = [...siteData.faqs, ...additionalQuestions];
  const exact = questions.find(item => normalizeQuestion(item.question) === normalized);
  if (exact) return replyForQuestion(exact);

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(normalized)) return { text: siteData.chatbot.welcome };
  if (/^(thank you|thanks|thank you so much|thanks a lot)$/.test(normalized)) return { text: 'You are welcome! Ask me another question whenever you are ready.', actions: [booking] };

  // Operational and suitability questions take priority over a service-name match.
  const matches = questions.flatMap(item => {
    const hits = item.keywords.filter(keyword => includesPhrase(normalized, keyword));
    return hits.length ? [{ item, score: Math.max(...hits.map(hit => normalizeQuestion(hit).length)) }] : [];
  }).sort((a, b) => b.score - a.score);
  const detailIds = new Set(['service-catalog', 'service-price', 'rebook', 'consultation', 'membership', 'double-chin-offer', 'training', 'teen-camp', 'groups']);
  const operational = matches.find(match => !detailIds.has(match.item.id));
  if (operational) return replyForQuestion(operational.item);

  let services = findServices(normalized);
  if (!services.length && previousQuestion && /^(how much|how much is it|what is the price|price|cost|how long|how long is it|what is the duration|duration|tell me more)$/.test(normalized)) {
    services = findServices(normalizeQuestion(previousQuestion));
  }
  if (services.length) return serviceReply(services);
  if (matches.length) return replyForQuestion(matches[0].item);

  if (includesPhrase(normalized, 'book') || includesPhrase(normalized, 'schedule an appointment')) return replyForQuestion(questions.find(item => item.id === 'book')!);
  if (['contact', 'phone', 'number', 'call'].some(word => includesPhrase(normalized, word))) return replyForQuestion(questions.find(item => item.id === 'phone')!);
  if (['where', 'located', 'directions'].some(word => includesPhrase(normalized, word))) return replyForQuestion(questions.find(item => item.id === 'location')!);
  if (['price', 'prices', 'cost', 'how much', 'how long'].some(word => includesPhrase(normalized, word))) return replyForQuestion(questions.find(item => item.id === 'service-price')!);
  return { text: siteData.chatbot.unknownAnswer, actions: [contact] };
}
