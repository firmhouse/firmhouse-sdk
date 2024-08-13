import { InputHTMLAttributes } from 'react';
import styles from './text-input.module.css';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  error?: string;
}

export function TextInput({
  label,
  error,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className={`${styles.inputContainer} ${className ? className : ''}`}>
      <label className={styles.labelText}>{label}</label>
      <input className={styles.inputText} {...props} />
      {error && <label className={styles.labelError}>{error}</label>}
    </div>
  );
}
