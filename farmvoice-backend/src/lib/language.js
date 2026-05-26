const supportedLanguages = ['en', 'ha', 'yo', 'sw', 'fr'];

function normalizeLanguage(language) {
  if (!language) return 'en';
  const value = String(language).toLowerCase().trim();
  if (supportedLanguages.includes(value)) return value;
  if (value.startsWith('ha')) return 'ha';
  if (value.startsWith('yo')) return 'yo';
  if (value.startsWith('sw')) return 'sw';
  if (value.startsWith('fr')) return 'fr';
  return 'en';
}

function languageName(code) {
  return {
    en: 'English',
    ha: 'Hausa',
    yo: 'Yoruba',
    sw: 'Swahili',
    fr: 'Français'
  }[normalizeLanguage(code)] || 'English';
}

function languageFlag(code) {
  return {
    en: '🇬🇧',
    ha: '🇳🇬',
    yo: '🇳🇬',
    sw: '🇰🇪',
    fr: '🇫🇷'
  }[normalizeLanguage(code)] || '🇬🇧';
}

module.exports = { supportedLanguages, normalizeLanguage, languageName, languageFlag };