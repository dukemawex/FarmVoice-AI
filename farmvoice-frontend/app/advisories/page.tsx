'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getAdvisories } from '@/lib/api';
import type { Advisory } from '@/lib/types';
import { AdvisoryCard } from '@/components/advisory-card';

const AdvisoryMap = dynamic(() => import('@/components/advisory-map'), { ssr: false });

export default function AdvisoriesPage() {
  const [country, setCountry] = useState('Nigeria');
  const [crop, setCrop] = useState('Maize');
  const [type, setType] = useState('weather');
  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  useEffect(() => {
    getAdvisories({ country, crop, type }).then(setAdvisories).catch(() => setAdvisories([]));
  }, [country, crop, type]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-savanna-slate">Active Advisories</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Country
              <input value={country} onChange={(event) => setCountry(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Crop
              <input value={crop} onChange={(event) => setCrop(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Type
              <select value={type} onChange={(event) => setType(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4">
                <option value="pest">pest</option>
                <option value="disease">disease</option>
                <option value="weather">weather</option>
                <option value="planting">planting</option>
                <option value="harvest">harvest</option>
                <option value="market">market</option>
              </select>
            </label>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            Current advisories help farmers act before losses happen. The map highlights the most affected regions.
          </div>
        </section>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <AdvisoryMap advisories={advisories} />
          </div>
          <div className="grid gap-4">
            {advisories.map((advisory) => <AdvisoryCard key={advisory.id} advisory={advisory} />)}
          </div>
        </div>
      </div>
    </main>
  );
}