import { useFirmhouseCart } from '../hooks';

export interface TranslatedProps {
  value: string;
  options?: Record<string, string | number>;
}

export function Translated({ value, options }: TranslatedProps) {
  const { t } = useFirmhouseCart();
  return options ? t?.(value, options) : t?.(value);
}
