import { InputHTMLAttributes } from 'react';
import styles from './date-input.module.css';

export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function DateInput({
  label,
  error,
  className,
  ...props
}: DateInputProps) {
  return (
    <div className={`${styles.inputContainer} ${className ? className : ''}`}>
      <label className={styles.labelText}>{label}</label>
      <input className={styles.inputText} type="date" {...props} />
      {error && <label className={styles.labelError}>{error}</label>}
    </div>
  );
}
