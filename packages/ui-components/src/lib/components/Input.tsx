import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  if (props.type === 'checkbox') {
    return (
      <div className="px-3 py-1">
        <input
          className="border-1 border-gray-200 rounded-lg focus:outline-1 focus:outline-blue-100 px-2 mr-1 placeholder-gray-400"
          {...props}
        />
        <label className="text-sm font-semibold text-gray-700 p-1">
          {label}
        </label>
        {error && (
          <label className="text-sm w-full text-red-500 p-2">{error}</label>
        )}
      </div>
    );
  }
  return (
    <div className="py-1 px-3 w-full">
      <label className="block text-sm font-semibold text-gray-700 p-1">
        {label}
      </label>
      <input
        className="border-2 border-gray-200 rounded-lg w-full focus:outline-1 focus:outline-blue-100 px-2 py-1.5 text-md placeholder-gray-400"
        {...props}
      />
      {error && (
        <label className="text-sm w-full text-red-500 p-2">{error}</label>
      )}
    </div>
  );
}
