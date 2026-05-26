'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { languageFlags, languageLabels, setPersistedLanguage } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/types';
import { cn } from '@/lib/utils';

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem('farmvoice-language') as LanguageCode | null;
    if (stored) setLanguage(stored);
  }, []);

  function selectLanguage(next: LanguageCode) {
    setLanguage(next);
    setPersistedLanguage(next);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50',
          compact && 'px-2'
        )}
      >
        <span className="text-base">{languageFlags[language]}</span>
        <span className={compact ? 'hidden' : 'hidden sm:inline'}>{languageLabels[language]}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {(['en', 'ha', 'yo', 'sw', 'fr'] as LanguageCode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectLanguage(item)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
            >
              <span>{languageFlags[item]}</span>
              <span>{languageLabels[item]}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}