import { InputHTMLAttributes, useCallback, useMemo, useState } from 'react';
import styles from './dropdown-input.module.css';

export interface DropdownInputProps
  extends InputHTMLAttributes<HTMLSelectElement> {
  label: string | React.ReactNode;
  error?: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
}

export function DropdownInput({
  label,
  error,
  options,
  className,
  defaultValue,
  onChange,
  ...props
}: DropdownInputProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? '');
  const optionElements = useMemo(
    () =>
      options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      )),
    [options]
  );
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(e.target.value);
      onChange?.(e);
    },
    [onChange]
  );
  return (
    <div className={`${styles.inputContainer} ${className ? className : ''}`}>
      <label className={styles.label}>{label}</label>
      <select
        value={selectedValue}
        {...props}
        onChange={onChangeHandler}
        className={styles.input}
      >
        {optionElements}
      </select>
      {error && <label className={styles.labelError}>{error}</label>}
    </div>
  );
}
