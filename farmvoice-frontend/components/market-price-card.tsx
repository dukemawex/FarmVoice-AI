import type { MarketPrice } from '@/lib/types';

export function MarketPriceCard({ prices }: { prices: MarketPrice[] }) {
  const best = prices[0];
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-savanna-green">
        Market Prices
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-[0.16em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Crop</th>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price/kg</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price.id} className={price.id === best?.id ? 'bg-orange-50/70' : 'border-t border-slate-100'}>
                <td className="px-4 py-3 font-medium text-slate-700">{price.crop}</td>
                <td className="px-4 py-3 text-slate-600">{price.market_name}</td>
                <td className="px-4 py-3 text-slate-600">{price.state_province || price.country}</td>
                <td className="px-4 py-3 font-semibold text-savanna-orange">{price.currency}{price.price_per_kg}</td>
                <td className="px-4 py-3 text-slate-500">{price.price_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}