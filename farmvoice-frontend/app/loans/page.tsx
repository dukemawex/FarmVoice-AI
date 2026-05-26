'use client';

import { useEffect, useState } from 'react';
import { getLoanProducts } from '@/lib/api';
import type { LoanProduct } from '@/lib/types';
import { LoanCard } from '@/components/loan-card';

export default function LoansPage() {
  const [country, setCountry] = useState('Nigeria');
  const [loans, setLoans] = useState<LoanProduct[]>([]);

  useEffect(() => {
    getLoanProducts(country).then(setLoans).catch(() => setLoans([]));
  }, [country]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-savanna-slate">Loan Products</h1>
        <div className="mt-5 max-w-sm">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Country
            <input value={country} onChange={(event) => setCountry(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4" />
          </label>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {loans.map((loan) => <LoanCard key={loan.id} loan={loan} />)}
      </div>
    </main>
  );
}