import { USSDSimulator } from '@/components/ussd-simulator';

export default function UssdSimulatorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-savanna-slate">USSD Simulator</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Test the feature phone experience before connecting an operator shortcode.</p>
      </div>
      <USSDSimulator />
    </main>
  );
}