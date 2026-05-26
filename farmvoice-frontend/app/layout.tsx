import type { Metadata } from 'next';
import { Lexend, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { SiteHeader } from '@/components/site-header';

const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'FarmVoice AI',
  description: 'Conversational AI agricultural extension agent for African smallholder farmers.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}