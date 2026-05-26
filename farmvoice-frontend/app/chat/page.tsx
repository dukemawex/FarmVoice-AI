'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Paperclip, Send, Mic, Sparkles, Bot, Upload } from 'lucide-react';
import { ChatBubble } from '@/components/chat-bubble';
import { OnboardingModal } from '@/components/onboarding-modal';
import { SuggestedQuestions } from '@/components/suggested-questions';
import { MarketPriceCard } from '@/components/market-price-card';
import { WeatherCard } from '@/components/weather-card';
import { LoanCard } from '@/components/loan-card';
import { startChat, loginFarmer } from '@/lib/api';
import type { ChatResponse, FarmerProfile, LoanProduct, MarketPrice } from '@/lib/types';
import { LanguageSelector } from '@/components/language-selector';

type ChatItem = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  createdAt: string;
  suggestions?: string[];
  marketPrices?: MarketPrice[];
  loans?: LoanProduct[];
  weather?: ChatResponse['weather'];
  advisory?: string;
};

const quickQuestions = [
  'Best time to plant maize?',
  'Yellow leaves on my crop?',
  "Today's tomato price?",
  'Is there rain this week?',
  'How to control army worm?',
  'Best fertilizer for rice?',
  'Where can I get a farm loan?',
  'How to store cassava?'
];

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatItem[]>([
    { id: 'welcome', role: 'assistant', content: 'Tell me what you are growing and I will help.', createdAt: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [openOnboarding, setOpenOnboarding] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedFarmer = window.localStorage.getItem('farmvoice-farmer');
    const storedLanguage = window.localStorage.getItem('farmvoice-language') || 'en';
    setLanguage(storedLanguage);
    if (storedFarmer) {
      const parsed = JSON.parse(storedFarmer) as FarmerProfile;
      setFarmer(parsed);
      setOpenOnboarding(false);
    } else {
      setOpenOnboarding(true);
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const fallbackSuggestions = useMemo(() => quickQuestions.slice(0, 4), []);

  async function submit(message: string, mediaUrl?: string) {
    if (!message.trim() && !mediaUrl) return;
    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content: message || 'Uploaded a crop photo', createdAt: new Date().toISOString() };
    setMessages((previous) => [...previous, userMessage]);
    setLoading(true);
    const response = await startChat({
      message,
      conversationId,
      farmerId: farmer?.id,
      language: language as any,
      mediaUrl
    });
    setConversationId(response.conversation_id);
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.reply,
        intent: response.intent,
        createdAt: new Date().toISOString(),
        suggestions: response.suggested_follow_ups,
        marketPrices: response.market_prices as MarketPrice[] | undefined,
        loans: response.loans as LoanProduct[] | undefined,
        weather: response.weather
      }
    ]);
    setInput('');
    setPreview(null);
    setLoading(false);
  }

  async function handleRegister(profile: FarmerProfile) {
    setFarmer(profile);
    window.localStorage.setItem('farmvoice-farmer', JSON.stringify(profile));
    const fresh = await loginFarmer(profile.phone || undefined, profile.whatsapp_id || undefined);
    if (fresh) {
      setFarmer(fresh);
      window.localStorage.setItem('farmvoice-farmer', JSON.stringify(fresh));
    }
  }

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
      <section className="flex min-h-[calc(100vh-108px)] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-savanna-green text-white"><Bot className="h-5 w-5" /></div>
            <div>
              <div className="font-display text-lg font-bold text-savanna-slate">FarmVoice AI</div>
              <div className="text-sm text-savanna-green">Online and ready</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector compact />
            <button type="button" className="h-11 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700">Profile</button>
          </div>
        </header>

        <div ref={listRef} className="hide-scrollbar flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-white via-orange-50/20 to-white px-4 py-5 lg:px-6">
          <div className="grid gap-5">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <ChatBubble role={message.role} content={message.content} intent={message.intent} timestamp={formatTime(message.createdAt)} />
                {message.role === 'assistant' && message.marketPrices?.length ? <MarketPriceCard prices={message.marketPrices} /> : null}
                {message.role === 'assistant' && message.weather ? <WeatherCard forecast={message.weather as any} advisory="Use this weather window to avoid spraying before rain and finish fertilizer application early in the morning." /> : null}
                {message.role === 'assistant' && message.loans?.length ? (
                  <div className="grid gap-4">{message.loans.slice(0, 3).map((loan) => <LoanCard key={loan.id} loan={loan} />)}</div>
                ) : null}
                {message.role === 'assistant' && message.suggestions?.length ? (
                  <SuggestedQuestions questions={message.suggestions} onSelect={(value) => setInput(value)} />
                ) : null}
              </div>
            ))}

            {loading ? (
              <div className="flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-savanna-green" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-savanna-orange [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400 [animation-delay:240ms]" />
                Typing...
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          {preview ? (
            <div className="mb-3 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
              <img src={preview} alt="Preview" className="h-12 w-12 rounded-xl object-cover" />
              Photo ready for analysis
            </div>
          ) : null}
          <div className="mb-3 flex flex-wrap gap-2">
            {fallbackSuggestions.map((question) => (
              <button key={question} type="button" onClick={() => setInput(question)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-savanna-green hover:text-savanna-green">
                {question}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-3 rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-sm">
            <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100">
              <Paperclip className="h-5 w-5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100"><Mic className="h-5 w-5" /></button>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={1} placeholder="Ask anything about crops, pests, weather or loans..." className="min-h-12 flex-1 resize-none rounded-2xl border border-transparent bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400" />
            <button type="button" onClick={() => submit(input, preview || undefined)} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-savanna-orange px-5 text-sm font-semibold text-white">
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </section>

      <aside className="hidden min-h-[calc(100vh-108px)] flex-col gap-5 lg:flex">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-savanna-green"><Sparkles className="h-4 w-4" /> Quick Questions</div>
          <div className="mt-4 grid gap-2">
            {quickQuestions.map((question) => (
              <button key={question} type="button" onClick={() => setInput(question)} className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 hover:border-savanna-green hover:bg-green-50/50">
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-savanna-green">Need help</div>
          <p className="mt-3 text-sm leading-7 text-slate-600">FarmVoice can answer in your language, suggest the cheapest local inputs, and help you decide when to sell.</p>
        </div>
      </aside>

      <OnboardingModal open={openOnboarding} onClose={() => setOpenOnboarding(false)} onRegistered={handleRegister} />
    </main>
  );
}