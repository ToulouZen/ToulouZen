import { enUS, fr } from 'date-fns/locale';
import I18n from 'i18n-js';
import { getLocales } from 'react-native-localize';
import * as internalEN from './en.json';
import * as internalFR from './fr.json';

const locales = getLocales();
const languageCode = locales[0].languageCode;

I18n.locale = languageCode;

I18n.fallbacks = true;
I18n.translations = {
  fr: internalFR,
  en: internalEN,
};

const dateLocales = {
  fr,
  en: enUS,
};
export const currentDateLocale = dateLocales[languageCode];

export default I18n;
