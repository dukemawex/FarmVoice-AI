'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CloudSun, LayoutDashboard, MessageCircleHeart, Tractor } from 'lucide-react';
import { LanguageSelector } from './language-selector';

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#fefefe]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-savanna-green text-white shadow-glow">
            <Tractor className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-bold tracking-tight text-savanna-slate">{t('appName')}</div>
            <div className="text-xs text-slate-500">{t('online')}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/chat" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Chat</Link>
          <Link href="/market" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Market</Link>
          <Link href="/advisories" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Advisories</Link>
          <Link href="/loans" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Loans</Link>
          <Link href="/dashboard" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Dashboard</Link>
          <Link href="/admin" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Admin</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Link href="/chat" className="inline-flex h-11 items-center gap-2 rounded-full bg-savanna-orange px-4 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
            <MessageCircleHeart className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </Link>
        </div>
      </div>
    </header>
  );
}