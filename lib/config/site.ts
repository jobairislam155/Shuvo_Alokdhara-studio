/**
 * Single source of truth for brand identity, navigation and social links.
 * Change the studio name, tagline or copy here — nothing else in the
 * codebase hardcodes these values.
 */
export const siteConfig = {
  name: 'Shuvo Khan',
  studio: 'শুভ আলোকধারা',
  tagline: 'Photography · Films · Stories',
  description:
    'Shuvo Khan is a photographer and filmmaker documenting weddings, portraits and commercial stories with a cinematic, editorial eye.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  location: 'Dhaka, Bangladesh',
  email: 'mdshuvoalamin93@gmail.com',
  phone: '+880 1930543067',
  ogImage: '/og-image.png',
};

export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'Photography', href: '/photography' },
  { label: 'Videography', href: '/videography' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
];

export const categories = [
  { label: 'All', value: 'all' },
  { label: 'Wedding', value: 'wedding' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Events', value: 'events' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Travel', value: 'travel' },
] as const;
