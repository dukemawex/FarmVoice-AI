import type { Advisory } from '@/lib/types';

export function AdvisoryCard({ advisory }: { advisory: Advisory }) {
  const badge = {
    pest: 'bg-orange-50 text-savanna-orange',
    disease: 'bg-red-50 text-red-700',
    weather: 'bg-sky-50 text-sky-700',
    planting: 'bg-green-50 text-savanna-green',
    harvest: 'bg-amber-50 text-amber-700',
    market: 'bg-purple-50 text-purple-700'
  }[advisory.advisory_type];

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-bold text-savanna-slate">{advisory.title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${badge}`}>{advisory.advisory_type}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{advisory.content}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
        {advisory.crop ? <span className="rounded-full bg-slate-50 px-3 py-1">{advisory.crop}</span> : null}
        {advisory.country ? <span className="rounded-full bg-slate-50 px-3 py-1">{advisory.country}</span> : null}
        {advisory.valid_from || advisory.valid_until ? <span className="rounded-full bg-slate-50 px-3 py-1">{advisory.valid_from} → {advisory.valid_until}</span> : null}
      </div>
    </article>
  );
}