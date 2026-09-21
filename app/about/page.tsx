import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { FadeIn } from '@/components/animations/RevealText';
import { duotonePlate } from '@/lib/data/placeholder-art';
import { cldImage, isCloudinaryConfigured } from '@/lib/cloudinary';
import { siteConfig } from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'About',
  description: `The story, philosophy and experience behind ${siteConfig.studio}.`,
};

const portrait = isCloudinaryConfigured
  ? cldImage('WhatsApp_Image_2025-10-30_at_04.17.28_168ac321', { width: 1200, height: 1500, crop: 'fill', gravity: 'face' })
  : duotonePlate('about-portrait', ['#1c1f22', '#8a97a3'], siteConfig.name, 'Portrait');

export default function AboutPage() {
  return (
    <section className="bg-ink pb-12 pt-32 md:pb-16 md:pt-40">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] w-full overflow-hidden lg:sticky lg:top-28">
              <SmartImage src={portrait} alt={`Portrait of ${siteConfig.name}`} fill className="object-cover" priority />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-6">
            <FadeIn>
              <h1 className="font-serif text-display-3 leading-tight text-ink-50">
                I don&rsquo;t just capture moments.
                <br />
                I preserve how they felt.
              </h1>
            </FadeIn>

            <div className="mt-8 space-y-8">
              <FadeIn delay={0.05}>
                <h2 className="mb-3 font-sans text-xs uppercase tracking-widest text-brass">
                  Introduction
                </h2>
                <p className="max-w-xl font-sans text-base leading-relaxed text-ink-100">
                  I&rsquo;m Shuvo, a photographer and filmmaker based in {siteConfig.location}. My work
                  sits somewhere between documentary and editorial — close enough to be honest,
                  composed enough to last.
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h2 className="mb-3 font-sans text-xs uppercase tracking-widest text-brass">Story</h2>
                <p className="max-w-xl font-sans text-base leading-relaxed text-ink-100">
                  I started out shooting friends&rsquo; weddings on borrowed gear, and the instinct
                  that made those photographs worth keeping — get close, wait, don&rsquo;t
                  interrupt — is still how I work today, just with better equipment and a lot
                  more patience.
                </p>
              </FadeIn>

              <FadeIn delay={0.15}>
                <h2 className="mb-3 font-sans text-xs uppercase tracking-widest text-brass">
                  Photography Philosophy
                </h2>
                <p className="max-w-xl font-sans text-base leading-relaxed text-ink-100">
                  Light first, moment second, technical perfection a distant third. I&rsquo;d
                  rather deliver a slightly imperfect frame that feels true than a flawless one
                  that feels staged.
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h2 className="mb-3 font-sans text-xs uppercase tracking-widest text-brass">
                  Videography Philosophy
                </h2>
                <p className="max-w-xl font-sans text-base leading-relaxed text-ink-100">
                  Film is pacing as much as it is imagery. I edit the way I&rsquo;d want to
                  remember the day — a little slower than real life, with room to breathe.
                </p>
              </FadeIn>

              <FadeIn delay={0.25}>
                <h2 className="mb-3 font-sans text-xs uppercase tracking-widest text-brass">
                  Experience
                </h2>
                <p className="max-w-xl font-sans text-base leading-relaxed text-ink-100">
                  Since 2019, covering weddings, portraits and commercial work across Bangladesh,
                  with select travel commissions further afield.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <h2 className="mb-3 font-sans text-xs uppercase tracking-widest text-brass">
                  Location
                </h2>
                <p className="max-w-xl font-sans text-base leading-relaxed text-ink-100">
                  Based in {siteConfig.location}, available for travel worldwide.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
