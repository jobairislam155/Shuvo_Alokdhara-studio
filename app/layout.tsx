import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/footer/Footer';
import { CustomCursor } from '@/components/animations/CustomCursor';
import { IntroLoader } from '@/components/animations/IntroLoader';
import { PageTransition } from '@/components/animations/PageTransition';
import { siteConfig } from '@/lib/config/site';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.studio} — Photography & Films`,
    template: `%s — ${siteConfig.studio}`,
  },
  description: siteConfig.description,
  keywords: ['photographer', 'videographer', 'wedding photography', 'Dhaka photographer', 'cinematic films'],
  authors: [{ name: siteConfig.studio }],
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: `${siteConfig.studio} — Photography & Films`,
    description: siteConfig.description,
    siteName: siteConfig.studio,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.studio }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.studio} — Photography & Films`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Runs before paint, so a returning visitor who chose the light
          theme never sees a dark flash first. Dark is the default brand
          look, so we only ever need to *add* the light override.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="cursor-none-desktop font-sans antialiased">
        <IntroLoader />
        <CustomCursor />
        <div className="film-grain" />
        <Navbar />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
