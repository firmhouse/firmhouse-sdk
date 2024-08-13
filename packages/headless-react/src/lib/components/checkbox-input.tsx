import { InputHTMLAttributes, useId } from 'react';
import styles from './checkbox-input.module.css';

export interface CheckboxInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'checkbox';
  label: string | React.ReactNode;
  error?: string;
}

export function CheckboxInput({
  label,
  error,
  className,
  type,
  ...props
}: CheckboxInputProps) {
  const id = useId();
  return (
    <div className={`${styles.inputContainer} ${className ?? ''}`}>
      <input
        id={id}
        className={styles.inputCheckbox}
        {...props}
        type={type ?? 'checkbox'}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      {error && <label className={styles.labelError}>{error}</label>}
    </div>
  );
}
