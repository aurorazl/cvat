const i18n = require('i18next').default;
const store = require('store');

let lng = store.get('language') || 'zh-CN';

i18n
  .init({
    resources: {
      //语言包资源
      "en-US": { 
        translation: require('./locales/en-US/index') 
      },
      "zh-CN": { 
        translation: require('./locales/zh-CN/index') 
      }
    },
    lng: lng,
    fallbackLng: lng,

    interpolation: {
      escapeValue: false
    },
    // keySeparator: false,
    // or
    nsSeparator: ':::',
    keySeparator: '::',   
  });