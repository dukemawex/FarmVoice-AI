import type { Advisory, ChatResponse, FarmerProfile, LanguageCode, LoanProduct, MarketPrice } from '@/lib/types';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    ...init,
    cache: 'no-store'
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function startChat(input: {
  message: string;
  conversationId?: string;
  farmerId?: string;
  language?: LanguageCode;
  mediaUrl?: string;
}) {
  return request<ChatResponse>('/.netlify/functions/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: input.message,
      conversation_id: input.conversationId,
      farmer_id: input.farmerId,
      language: input.language,
      media_url: input.mediaUrl,
      channel: 'web'
    })
  });
}

export async function registerFarmer(payload: {
  name: string;
  phone?: string;
  country: string;
  language: LanguageCode;
  crops: string[];
  farm_size: number;
}) {
  const result = await request<{ farmer: FarmerProfile }>('/.netlify/functions/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return result.farmer;
}

export async function loginFarmer(phone?: string, whatsappId?: string) {
  const result = await request<{ farmer: FarmerProfile | null }>('/.netlify/functions/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, whatsapp_id: whatsappId })
  });
  return result.farmer;
}

export async function getMarketPrices(filters?: { crop?: string; country?: string; state?: string; state_province?: string }) {
  const params = new URLSearchParams();
  if (filters?.crop) params.set('crop', filters.crop);
  if (filters?.country) params.set('country', filters.country);
  if (filters?.state) params.set('state', filters.state);
  if (filters?.state_province) params.set('state_province', filters.state_province);
  const result = await request<{ prices: MarketPrice[] }>(`/.netlify/functions/market?${params.toString()}`);
  return result.prices;
}

export async function getWeather(lat: number, lng: number) {
  const result = await request<{ forecast: unknown; advisory: string }>(`/.netlify/functions/weather?lat=${lat}&lng=${lng}`);
  return result;
}

export async function getAdvisories(filters?: { country?: string; crop?: string; type?: string }) {
  const params = new URLSearchParams();
  if (filters?.country) params.set('country', filters.country);
  if (filters?.crop) params.set('crop', filters.crop);
  if (filters?.type) params.set('type', filters.type);
  const result = await request<{ advisories: Advisory[] }>(`/.netlify/functions/advisories?${params.toString()}`);
  return result.advisories;
}

export async function getLoanProducts(country: string) {
  const result = await request<{ loans: LoanProduct[] }>(`/.netlify/functions/loans/${encodeURIComponent(country)}`);
  return result.loans;
}

export async function submitFeedback(conversationId: string, rating: number, comment?: string, farmerId?: string) {
  return request('/.netlify/functions/feedback', {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId, rating, comment, farmer_id: farmerId })
  });
}

export async function sendUssdMessage(sessionId: string, phoneNumber: string, text: string) {
  const response = await fetch(`${baseUrl}/.netlify/functions/ussd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, phoneNumber, text })
  });
  if (!response.ok) throw new Error('USSD request failed');
  return response.text();
}

export async function getAdminDashboard() {
  const result = await request<{ dashboard: unknown }>('/.netlify/functions/analytics');
  return result.dashboard;
}