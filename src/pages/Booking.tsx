import { siteData } from '../data.js';
import { SquareBooking } from '../components/SquareBooking';
import { PageIntro, Photo, TextLink } from '../components/Shared';

export function Booking() {
  const content = siteData.pages.booking;
  return <><PageIntro heading={content.heading} intro={content.intro} /><section className="container booking-layout"><Photo image={content.image} eager /><SquareBooking /></section><section className="container booking-question"><h2>{siteData.booking.question}</h2><p>{siteData.booking.questionText}</p><TextLink href={siteData.actions.inquire.href}>{siteData.actions.inquire.label}</TextLink></section></>;
}
