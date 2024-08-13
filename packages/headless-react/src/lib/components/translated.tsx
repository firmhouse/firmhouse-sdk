import { useFirmhouseCart } from '../hooks';

export interface TranslatedProps {
  key: string;
  options?: Record<string, string | number>;
  defaultValue?: string;
}

export function Translated({ key, options, defaultValue }: TranslatedProps) {
  const { t } = useFirmhouseCart();
  return options ? t?.(key, options) : t?.(key);
}
