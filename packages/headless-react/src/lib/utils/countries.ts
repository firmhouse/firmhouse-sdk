/* eslint @typescript-eslint/no-var-requires: "off" */
import countries from 'i18n-iso-countries';

const de = require('i18n-iso-countries/langs/de.json');
const en = require('i18n-iso-countries/langs/en.json');
const es = require('i18n-iso-countries/langs/es.json');
const fi = require('i18n-iso-countries/langs/fi.json');
const fr = require('i18n-iso-countries/langs/fr.json');
const it = require('i18n-iso-countries/langs/it.json');
const nl = require('i18n-iso-countries/langs/nl.json');
const pl = require('i18n-iso-countries/langs/pl.json');
const ro = require('i18n-iso-countries/langs/ro.json');
const sv = require('i18n-iso-countries/langs/sv.json');

countries.registerLocale(de);
countries.registerLocale(en);
countries.registerLocale(es);
countries.registerLocale(fi);
countries.registerLocale(fr);
countries.registerLocale(it);
countries.registerLocale(nl);
countries.registerLocale(pl);
countries.registerLocale(ro);
countries.registerLocale(sv);

export function getAvailableCountryOptions(
  availableCountries?: string[],
  locale = 'en'
): { value: string; label: string }[] {
  const allCountries = availableCountries
    ? availableCountries
    : Object.keys(countries.getAlpha2Codes);
  return allCountries.map((code) => {
    return {
      value: code,
      label: countries.getName(code, locale) ?? code,
    };
  });
}
