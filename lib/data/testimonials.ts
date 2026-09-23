import { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    client_name: 'Mithi & Imtiaz',
    project_type: 'Wedding',
    testimonial:
      "Shuvo disappeared into the day in the best way — we forgot we were being photographed. The film still makes us cry, in a good way.",
    published: true,
  },
  {
    id: '2',
    client_name: 'Richi',
    project_type: 'Portrait',
    testimonial:
      'I have never felt more like myself in front of a camera. Patient, precise, and somehow made a studio session feel calm.',
    published: true,
  },
  {
    id: '3',
    client_name: 'Imtiaz',
    project_type: 'Commercial',
    testimonial:
      'The brand shoot came back better than our mood board. Fast turnaround without ever feeling rushed on set.',
    published: true,
  },
  {
    id: '4',
    client_name: 'Riyad',
    project_type: 'Event',
    testimonial:
      'We had a same-day highlight reel ready before the closing keynote finished. Genuinely impressive under pressure.',
    published: true,
  },
  {
    id: '5',
    client_name: 'Richi & Riyad',
    project_type: 'Wedding',
    testimonial:
      'The whole shoot was a dream come true. We had a great time shooting the wedding, and the film was a huge hit.',
    published: true,
  },
];

export function getPublishedTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.published);
}
