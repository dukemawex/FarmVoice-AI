import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { LanguageCode } from './types';

export const languageLabels: Record<LanguageCode, string> = {
  en: 'English',
  ha: 'Hausa',
  yo: 'Yoruba',
  sw: 'Swahili',
  fr: 'Français'
};

export const languageFlags: Record<LanguageCode, string> = {
  en: '🇬🇧',
  ha: '🇳🇬',
  yo: '🇳🇬',
  sw: '🇰🇪',
  fr: '🇫🇷'
};

export const resources = {
  en: {
    translation: {
      appName: 'FarmVoice AI',
      online: 'Online',
      startChatting: 'Start Chatting Now',
      askQuestion: 'Ask a question',
      send: 'Send',
      country: 'Country',
      language: 'Language',
      fullName: 'Full name',
      phone: 'Phone number',
      crops: 'Primary crops',
      farmSize: 'Farm size (hectares)',
      continue: 'Continue',
      welcome: 'Your AI Farming Expert. Available 24/7.',
      heroSubhead: 'Get expert advice on crops, pests, market prices & loans. Works on any phone - web, WhatsApp, or USSD.'
    }
  },
  ha: { translation: { appName: 'FarmVoice AI', online: 'A kan layi', startChatting: 'Fara hira yanzu', askQuestion: 'Tambayi tambaya', send: 'Aika', country: 'Ƙasa', language: 'Harshe', fullName: 'Cikakken suna', phone: 'Lambar waya', crops: 'Manyan amfanin gona', farmSize: 'Girman gona (hektare)', continue: 'Ci gaba', welcome: 'Masanin noma na AI. Akwai 24/7.', heroSubhead: 'Samun shawara kan amfanin gona, kwari, farashi da lamuni. Yana aiki a kowane waya - yanar gizo, WhatsApp, ko USSD.' } },
  yo: { translation: { appName: 'FarmVoice AI', online: 'Lori ayelujara', startChatting: 'Bẹrẹ iwiregbe', askQuestion: 'Beere ibeere', send: 'Ránṣẹ́', country: 'Orilẹ-ede', language: 'Ede', fullName: 'Orukọ kikun', phone: 'Nọ́mbà fónu', crops: 'Awọn irugbin akọkọ', farmSize: 'Iwọn oko (hektari)', continue: 'Tẹsiwaju', welcome: 'Amoye oko AI rẹ. Wa 24/7.', heroSubhead: 'Gba imọran lori irugbin, kokoro, idiyele ọja ati awin. O ṣiṣẹ lori gbogbo foonu - wẹẹbu, WhatsApp, tabi USSD.' } },
  sw: { translation: { appName: 'FarmVoice AI', online: 'Mtandaoni', startChatting: 'Anza Mazungumzo Sasa', askQuestion: 'Uliza swali', send: 'Tuma', country: 'Nchi', language: 'Lugha', fullName: 'Jina kamili', phone: 'Nambari ya simu', crops: 'Mazao makuu', farmSize: 'Ukubwa wa shamba (hekta)', continue: 'Endelea', welcome: 'Mtaalamu wako wa kilimo wa AI. Inapatikana 24/7.', heroSubhead: 'Pata ushauri wa mazao, wadudu, bei za soko na mikopo. Inafanya kazi kwenye simu yoyote - wavuti, WhatsApp, au USSD.' } },
  fr: { translation: { appName: 'FarmVoice AI', online: 'En ligne', startChatting: 'Commencer à discuter', askQuestion: 'Poser une question', send: 'Envoyer', country: 'Pays', language: 'Langue', fullName: 'Nom complet', phone: 'Téléphone', crops: 'Cultures principales', farmSize: 'Taille de l’exploitation (hectares)', continue: 'Continuer', welcome: 'Votre expert agricole IA. Disponible 24h/24.', heroSubhead: 'Obtenez des conseils sur les cultures, ravageurs, prix du marché et prêts. Fonctionne sur n’importe quel téléphone - web, WhatsApp ou USSD.' } }
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
}

export function setPersistedLanguage(language: LanguageCode) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('farmvoice-language', language);
  }
  i18n.changeLanguage(language);
}

export function getPersistedLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem('farmvoice-language');
  return (stored as LanguageCode) || 'en';
}

export default i18n;