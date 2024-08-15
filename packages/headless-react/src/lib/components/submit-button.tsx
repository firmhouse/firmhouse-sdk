import { InputHTMLAttributes } from 'react';

export type SubmitButtonProps = InputHTMLAttributes<HTMLInputElement>;

export function SubmitButton({ type, ...props }: SubmitButtonProps) {
  return <input type="submit" {...props} />;
}
