import { Bot, Wheat } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ChatBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  timestamp?: string;
};

export function ChatBubble({ role, content, intent, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex items-end gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-savanna-green text-white shadow-sm">
          <Wheat className="h-5 w-5" />
        </div>
      ) : null}
      <div className={cn('max-w-[88%] rounded-[1.4rem] px-4 py-3 text-sm leading-7 shadow-sm lg:max-w-[72%]', isUser ? 'bg-savanna-orange text-white' : 'border border-slate-200 bg-white text-slate-800')}>
        {intent ? <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{intent}</div> : null}
        <div className="whitespace-pre-wrap">{content}</div>
        {timestamp ? <div className={cn('mt-2 text-[11px]', isUser ? 'text-white/70' : 'text-slate-400')}>{timestamp}</div> : null}
      </div>
      {isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-savanna-orange shadow-sm ring-1 ring-orange-100">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  );
}