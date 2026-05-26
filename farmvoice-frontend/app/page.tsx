import Link from 'next/link';
import { ArrowRight, MessageCircle, Smartphone, Sprout, Waves, Wheat } from 'lucide-react';
import { TopicCloud } from '@/components/topic-cloud';
import { TestimonialCarousel } from '@/components/testimonial-carousel';

const channels = [
  { title: 'Web Chat', description: 'Instant advice in your browser.', href: '/chat', icon: MessageCircle, note: 'Best on smartphones' },
  { title: 'WhatsApp', description: 'Dial in through WhatsApp messaging.', href: '/chat', icon: Smartphone, note: 'Use your existing number' },
  { title: 'USSD', description: 'Dial *384# on any feature phone.', href: '/ussd-simulator', icon: Waves, note: 'No data required' }
];

const topics = ['Pest Control', 'Disease Treatment', 'Market Prices', 'Planting Calendar', 'Fertilizer', 'Irrigation', 'Loans', 'Weather', 'Harvest Timing', 'Storage'];

const testimonials = [
  { name: 'Amina, Kano', quote: 'FarmVoice helped me know when to spray and when to sell maize.' },
  { name: 'Moses, Nakuru', quote: 'The WhatsApp answers are short and clear even when my network is weak.' },
  { name: 'Awa, Thiès', quote: 'I got a loan option and a rainfall warning in French the same day.' }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-hero-sunrise px-6 py-16 text-white shadow-glow lg:px-12 lg:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute right-12 top-16 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <Sprout className="h-4 w-4" />
              Available 24/7 on web, WhatsApp and USSD
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl xl:text-7xl">
              Your AI Farming Expert. Available 24/7.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 md:text-xl">
              Get expert advice on crops, pests, market prices & loans. Works on any phone - web, WhatsApp, or USSD.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/chat" className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-6 text-base font-semibold text-savanna-green transition hover:-translate-y-0.5">
                Start Chatting Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/ussd-simulator" className="inline-flex h-14 items-center gap-3 rounded-full border border-white/40 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15">
                Try USSD Demo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-white/90">
              <span className="rounded-full bg-white/15 px-3 py-2">🇬🇧 English</span>
              <span className="rounded-full bg-white/15 px-3 py-2">🇳🇬 Hausa</span>
              <span className="rounded-full bg-white/15 px-3 py-2">🇳🇬 Yoruba</span>
              <span className="rounded-full bg-white/15 px-3 py-2">🇰🇪 Swahili</span>
              <span className="rounded-full bg-white/15 px-3 py-2">🇫🇷 Français</span>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-white/30 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-savanna-green">
                <Wheat className="h-7 w-7" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-white/70">Extension officer</div>
                <div className="font-display text-2xl font-semibold">Always on duty</div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <Link key={channel.title} href={channel.href} className="rounded-3xl bg-white px-4 py-4 text-savanna-slate transition hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-savanna-green">
                          <Icon className="h-4 w-4" />
                          {channel.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{channel.description}</p>
                        <div className="mt-3 text-xs font-medium text-slate-500">{channel.note}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-savanna-slate">What FarmVoice covers</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <TopicCloud topics={topics} />
          </div>
        </div>

        <TestimonialCarousel testimonials={testimonials.map((item) => ({ ...item, language: 'local language' }))} />
      </section>
    </main>
  );
}