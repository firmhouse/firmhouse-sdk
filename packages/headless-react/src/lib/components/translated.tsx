import { useFirmhouseCart } from '../hooks';

export interface TranslatedProps {
  value: string;
  options?: Record<string, string | number>;
  defaultValue?: string;
}

export function Translated({ value, options }: TranslatedProps) {
  const { t } = useFirmhouseCart();
  return options ? t?.(value, options) : t?.(value);
}
