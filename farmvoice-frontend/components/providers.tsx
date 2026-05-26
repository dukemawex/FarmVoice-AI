'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { getPersistedLanguage, setPersistedLanguage } from '@/lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setPersistedLanguage(getPersistedLanguage());
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}