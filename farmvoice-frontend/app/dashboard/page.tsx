'use client';

import { useEffect, useState } from 'react';
import type { FarmerProfile } from '@/lib/types';

export default function DashboardPage() {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('farmvoice-farmer');
    if (stored) {
      setFarmer(JSON.parse(stored));
    }
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-savanna-slate">Farmer Dashboard</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Track your profile, saved advice, conversations and feedback history.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-savanna-green">Profile</div>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div>Name: {farmer?.full_name || 'Not set'}</div>
            <div>Country: {farmer?.country || 'Not set'}</div>
            <div>Language: {farmer?.language || 'en'}</div>
            <div>Crops: {farmer?.primary_crops?.join(', ') || 'Not set'}</div>
            <div>Farm size: {farmer?.farm_size_hectares || 'Not set'} hectares</div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-savanna-green">Recent conversations</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Yellow leaves on maize - yesterday</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Tomato market prices - 3 days ago</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Rain forecast for Kano - last week</div>
          </div>
        </section>
      </div>
    </main>
  );
}