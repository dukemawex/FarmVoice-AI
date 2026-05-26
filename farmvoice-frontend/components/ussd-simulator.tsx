'use client';

import { useMemo, useState } from 'react';
import { sendUssdMessage } from '@/lib/api';

const screenWidth = 'w-[18rem]';

export function USSDSimulator() {
  const [sessionId] = useState(() => `demo-${Math.random().toString(16).slice(2)}`);
  const [phoneNumber] = useState('+2348012345678');
  const [text, setText] = useState('');
  const [log, setLog] = useState<string[]>(['Welcome to FarmVoice AI']);
  const [loading, setLoading] = useState(false);

  const keypad = useMemo(() => [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ], []);

  async function submit(nextText: string) {
    setLoading(true);
    try {
      const response = await sendUssdMessage(sessionId, phoneNumber, nextText);
      setText(nextText);
      setLog((previous) => [...previous.slice(-5), response]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex justify-center">
        <div className="rounded-[2.5rem] bg-[#c7c7c7] p-4 shadow-2xl ring-8 ring-slate-200">
          <div className="mx-auto flex h-[34rem] w-[18rem] flex-col rounded-[2rem] bg-gradient-to-b from-[#585f66] to-[#3d4348] p-4">
            <div className="rounded-[1.4rem] bg-[#1f2327] p-3 shadow-inner">
              <div className="pixel-font min-h-[10rem] rounded-[1rem] bg-[#d7ddb2] p-3 text-[0.78rem] leading-5 text-[#1d2618]">
                <div className="font-bold">FarmVoice AI</div>
                <div className="mt-2 whitespace-pre-wrap">{log[log.length - 1]}</div>
              </div>
            </div>
            <div className="mt-4 grid flex-1 grid-cols-3 gap-2">
              {keypad.flat().map((key) => (
                <button key={key} type="button" className="rounded-2xl bg-[#b9c0c7] text-lg font-semibold text-[#1f2327] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)]">{key}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-savanna-slate">USSD Simulator</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">Dial-style interactions without a network operator. Use it to test the menu flow, session state and truncated answers.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button type="button" onClick={() => submit('')} disabled={loading} className="h-12 rounded-full bg-savanna-green px-4 text-sm font-semibold text-white disabled:opacity-60">Start session</button>
          <button type="button" onClick={() => submit('1')} disabled={loading} className="h-12 rounded-full bg-savanna-orange px-4 text-sm font-semibold text-white disabled:opacity-60">Ask a question</button>
          <button type="button" onClick={() => submit('2')} disabled={loading} className="h-12 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 disabled:opacity-60">Market prices</button>
          <button type="button" onClick={() => submit('3')} disabled={loading} className="h-12 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 disabled:opacity-60">Weather forecast</button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-4">
          <label className="text-sm font-medium text-slate-700">Manual USSD text input</label>
          <div className="mt-3 flex gap-3">
            <input value={text} onChange={(event) => setText(event.target.value)} className="h-12 flex-1 rounded-full border border-slate-200 px-4 outline-none focus:border-savanna-green" placeholder="1*2*..." />
            <button type="button" onClick={() => submit(text)} className="h-12 rounded-full bg-savanna-orange px-5 text-sm font-semibold text-white">Send</button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {log.map((entry, index) => (
            <div key={`${entry}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}