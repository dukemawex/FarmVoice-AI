export type LanguageCode = 'en' | 'ha' | 'yo' | 'sw' | 'fr';

export type FarmerProfile = {
  id: string;
  phone?: string | null;
  whatsapp_id?: string | null;
  full_name?: string | null;
  language: LanguageCode;
  country?: string | null;
  state_province?: string | null;
  primary_crops?: string[] | null;
  farm_size_hectares?: number | null;
  channel?: 'web' | 'whatsapp' | 'ussd' | null;
};

export type ChatResponse = {
  reply: string;
  conversation_id: string;
  intent: string;
  language?: LanguageCode;
  suggested_follow_ups: string[];
  weather?: unknown;
  market_prices?: unknown[];
  advisories?: unknown[];
  loans?: unknown[];
};

export type MarketPrice = {
  id: string;
  crop: string;
  market_name: string;
  country: string;
  state_province?: string | null;
  price_per_kg: number;
  currency: string;
  price_date: string;
  source?: string | null;
};

export type Advisory = {
  id: string;
  title: string;
  content: string;
  crop?: string | null;
  country?: string | null;
  advisory_type: 'pest' | 'disease' | 'weather' | 'planting' | 'harvest' | 'market';
  valid_from?: string | null;
  valid_until?: string | null;
  source?: string | null;
};

export type LoanProduct = {
  id: string;
  provider_name: string;
  product_name: string;
  country: string;
  min_amount: number;
  max_amount: number;
  currency: string;
  interest_rate: number;
  tenure_months: number;
  eligibility_criteria: string;
  application_url?: string | null;
  phone_number?: string | null;
  active: boolean;
};