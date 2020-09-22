import moment from "moment";
import 'moment/locale/es-us';
import 'moment/locale/zh-cn';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './locale/en-US';
import cn from './locale/zh-CN';

const lng = localStorage.language || navigator.language;

console.log('lng-', lng)

moment.locale(lng);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      "en-US": {
        translation: {
          ...en
        }
      },
      "zh-CN": {
        translation: {
          ...cn
        }
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