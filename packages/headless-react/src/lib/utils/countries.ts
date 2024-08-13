import countries from 'i18n-iso-countries';
import de from 'i18n-iso-countries/langs/de.json';
import en from 'i18n-iso-countries/langs/en.json';
import es from 'i18n-iso-countries/langs/es.json';
import fi from 'i18n-iso-countries/langs/fi.json';
import fr from 'i18n-iso-countries/langs/fr.json';
import it from 'i18n-iso-countries/langs/it.json';
import nl from 'i18n-iso-countries/langs/nl.json';
import pl from 'i18n-iso-countries/langs/pl.json';
import ro from 'i18n-iso-countries/langs/ro.json';
import sv from 'i18n-iso-countries/langs/sv.json';
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
