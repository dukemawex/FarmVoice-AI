import type { LoanProduct } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

export function LoanCard({ loan }: { loan: LoanProduct }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-savanna-green">{loan.provider_name}</div>
          <h3 className="mt-1 text-xl font-bold text-savanna-slate">{loan.product_name}</h3>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-savanna-orange">
          {loan.interest_rate}% p.a.
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div>Amount: {loan.currency}{loan.min_amount.toLocaleString()} - {loan.currency}{loan.max_amount.toLocaleString()}</div>
        <div>Tenure: {loan.tenure_months} months</div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{loan.eligibility_criteria}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {loan.application_url ? (
          <a href={loan.application_url} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-savanna-orange px-4 text-sm font-semibold text-white">
            Apply Now <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        {loan.phone_number ? <span className="inline-flex h-11 items-center rounded-full bg-slate-50 px-4 text-sm font-medium text-slate-700">Call {loan.phone_number}</span> : null}
      </div>
    </article>
  );
}