'use client';

import { useState } from 'react';
import { CropSelector } from './crop-selector';
import { registerFarmer } from '@/lib/api';
import type { LanguageCode, FarmerProfile } from '@/lib/types';
import { languageLabels } from '@/lib/i18n';

export function OnboardingModal({ open, onClose, onRegistered }: { open: boolean; onClose: () => void; onRegistered: (farmer: FarmerProfile) => void }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [crops, setCrops] = useState<string[]>(['Maize']);
  const [farmSize, setFarmSize] = useState('2');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    const farmer = await registerFarmer({
      name,
      phone,
      country,
      language,
      crops,
      farm_size: Number(farmSize)
    });
    onRegistered(farmer);
    onClose();
    setSaving(false);
  }

  return (
    open ? (
      <div className="fixed inset-0 z-[100]">
        <button type="button" aria-label="Close onboarding" onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <div className="relative flex h-full items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl lg:p-8">
            <div className="font-display text-2xl font-bold text-savanna-slate">Tell us about your farm</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">This helps FarmVoice tailor advice to your crops, location and language.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Full name
              <input value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-savanna-green" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Phone number
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-savanna-green" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
                </div>
              <input value={country} onChange={(event) => setCountry(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-savanna-green" />
                <div className="mt-6">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Farm size (hectares)
                </div>
            </label>
                <div className="mt-8 flex flex-wrap justify-end gap-3">
                  <button type="button" onClick={onClose} className="h-12 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700">
                    Skip for now
                  </button>
                  <button type="button" disabled={saving} onClick={submit} className="h-12 rounded-full bg-savanna-orange px-5 text-sm font-semibold text-white disabled:opacity-60">
                    {saving ? 'Saving...' : 'Continue'}
                  </button>
                </div>
            </label>

        ) : null
            <CropSelector value={crops} onChange={setCrops} />
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={onClose} className="h-12 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700">
              Skip for now
            </button>
            <button type="button" disabled={saving} onClick={submit} className="h-12 rounded-full bg-savanna-orange px-5 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}