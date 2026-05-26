function suggestedFollowUps(intent, language = 'en') {
  const common = {
    en: ['Can you share a photo?', 'What crop variety are you growing?', 'How long have the symptoms been present?'],
    ha: ['Za ka iya turo hoto?', 'Wane irin iri kake shukawa?', 'Tun yaushe alamun suka fara?'],
    yo: ['Ṣe o le fi fọto ranṣẹ?', 'Iru irugbin wo ni o n gbin?', 'Láti igba wo ni ìṣòro náà ti bẹ̀rẹ̀?'],
    sw: ['Unaweza kutuma picha?', 'Unapanda aina gani ya zao?', 'Dalili zimeanza lini?'],
    fr: ['Pouvez-vous envoyer une photo ?', 'Quelle culture plantez-vous ?', 'Depuis quand les symptômes ont-ils commencé ?']
  };

  const byIntent = {
    market_query: {
      en: ['Which market is closest to you?', 'Do you want today or weekly prices?', 'What crop do you want to sell first?'],
      ha: ['Wane kasuwa ya fi kusa da kai?', 'Kana son farashin yau ko na mako?', 'Wane amfanin gona kake son sayarwa?'],
      yo: ['Oja wo ni o sunmọ ọ?', 'Ṣe o fẹ owó loni tàbí osẹ?', 'Irugbin wo ni o fẹ ta?'],
      sw: ['Soko gani iko karibu nawe?', 'Unataka bei ya leo au ya wiki?', 'Ni zao gani unataka kuuza kwanza?'],
      fr: ['Quel marché est le plus proche ?', 'Voulez-vous les prix d’aujourd’hui ou de la semaine ?', 'Quelle culture voulez-vous vendre en premier ?']
    },
    weather_query: {
      en: ['Do you need a planting or harvesting plan?', 'Which field is most exposed?', 'Should I warn about flooding or heat?'],
      ha: ['Kana bukatar shirin shuka ko girbi?', 'Wane fili ne ya fi fuskantar matsala?', 'Ina sanar da ambaliyar ruwa ko zafi sosai?'],
      yo: ['Ṣe o nilo eto gbin tàbí ikore?', 'Ohu ilẹ wo ni o fara han si i?', 'Ṣe mo kilọ fun ìjápọ omi tabi ooru?',],
      sw: ['Unahitaji mpango wa kupanda au kuvuna?', 'Shamba gani liko wazi zaidi?', 'Niwonye kuhusu mafuriko au joto?'],
      fr: ['Avez-vous besoin d’un plan de semis ou de récolte ?', 'Quelle parcelle est la plus exposée ?', 'Faut-il alerter sur les inondations ou la chaleur ?']
    },
    loan_query: {
      en: ['How much funding do you need?', 'Do you have a bank account or mobile money?', 'What crop income can you expect?'],
      ha: ['Nawa zaka bukata?', 'Kana da asusun banki ko mobile money?', 'Wane kudin shiga daga amfanin gona kake sa rai?'],
      yo: ['Elo melo ni o fẹ?', 'Ṣe o ni iroyin banki tabi mobile money?', 'Owo wọle melo ni o reti lati irugbin?'],
      sw: ['Unahitaji fedha kiasi gani?', 'Una akaunti ya benki au mobile money?', 'Unatarajia mapato gani kutokana na zao?'],
      fr: ['De quel montant avez-vous besoin ?', 'Avez-vous un compte bancaire ou mobile money ?', 'Quel revenu attendez-vous de la culture ?']
    }
  };

  return (byIntent[intent] && byIntent[intent][language]) || common[language] || common.en;
}

function compactUSSD(text, maxChars = 182) {
  if (!text) return '';
  const trimmed = String(text).replace(/\s+/g, ' ').trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}

module.exports = { suggestedFollowUps, compactUSSD };