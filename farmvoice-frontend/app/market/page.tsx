'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getMarketPrices } from '@/lib/api';
import type { MarketPrice } from '@/lib/types';
import { MarketPriceCard } from '@/components/market-price-card';

const crops = ['Maize', 'Cassava', 'Rice', 'Tomato', 'Yam'];
const countries = ['Nigeria', 'Kenya', 'Ghana', 'Uganda', 'Tanzania'];

export default function MarketPage() {
  const [crop, setCrop] = useState('Maize');
  const [country, setCountry] = useState('Nigeria');
  const [prices, setPrices] = useState<MarketPrice[]>([]);

  useEffect(() => {
    getMarketPrices({ crop, country }).then(setPrices).catch(() => setPrices([]));
  }, [crop, country]);

  const chartData = useMemo(() => prices.slice(0, 8).map((price) => ({ market: price.market_name, price: price.price_per_kg })), [prices]);

  const best = prices[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="font-display text-3xl font-bold text-savanna-slate">Market Prices</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">Compare crop prices across markets and identify the best place to sell today.</p>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Crop
              <select value={crop} onChange={(event) => setCrop(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 outline-none">
                {crops.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Country
              <select value={country} onChange={(event) => setCountry(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 outline-none">
                {countries.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-savanna-green px-5 py-4 text-white">
            <div className="text-sm uppercase tracking-[0.18em] text-white/80">Best market today</div>
            <div className="mt-2 text-2xl font-bold">{best ? `${best.market_name} - ${best.currency}${best.price_per_kg}/kg` : 'Loading prices...'}</div>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-savanna-green">Price Comparison</div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="market" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="price" fill="#E07B39" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <MarketPriceCard prices={prices} />
        </section>
      </div>
    </main>
  );
}