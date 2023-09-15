import { SelectHTMLAttributes } from 'react';

export interface SelectOptionType {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOptionType[];
  error?: string;
}

export function Select({
  label,
  options,
  placeholder,
  error,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="py-1 px-3 w-full">
      <label className="block text-sm font-semibold text-gray-700 p-1">
        {label}
      </label>
      <select
        className="border-2 bg-white border-gray-200 rounded-lg w-full focus:outline-1 focus:outline-blue-100 px-2 pt-1.5 pb-[7px] text-md required:invalid:text-gray-400"
        {...props}
        defaultValue={props.defaultValue ?? ''}
      >
        {placeholder && (
          <option className="text-gray-200" value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            className="!text-black"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <label className="text-sm w-full text-red-500 p-2">{error}</label> }
    </div>
  );
}
