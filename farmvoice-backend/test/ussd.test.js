const { compactUSSD } = require('../src/lib/rules');
const { menuRoot, languageFromChoice, cropFromChoice } = require('../src/services/ussdState');

describe('ussd state helpers', () => {
  test('menuRoot shows the main menu', () => {
    expect(menuRoot()).toContain('Welcome to FarmVoice AI');
    expect(menuRoot()).toContain('5. Change language');
  });

  test('language and crop choices are mapped', () => {
    expect(languageFromChoice('2')).toBe('ha');
    expect(cropFromChoice('4')).toBe('tomato');
  });

  test('compactUSSD truncates long text', () => {
    const text = 'a'.repeat(220);
    expect(compactUSSD(text)).toHaveLength(182);
  });
});