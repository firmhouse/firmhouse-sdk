import countryTranslations from './country-translations';
export function getAvailableCountryOptions(
  availableCountries?: string[],
  locale = 'en'
): { value: string; label: string }[] {
  const allCountries =
    availableCountries ?? Object.keys(countryTranslations['en']);
  return allCountries.map((code) => {
    return {
      value: code,
      label: countryTranslations[locale][code],
    };
  });
}
