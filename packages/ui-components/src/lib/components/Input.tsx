import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({label, ...props}: InputProps) {
  if(props.type === 'checkbox') {
    return (
      <div className="px-3 py-1">
        <input
          className="border-1 border-gray-200 rounded-lg focus:outline-1 focus:outline-blue-100 px-2 mr-1"
          {...props}
        />
        <label className="text-sm font-semibold text-gray-700 p-1">{label}</label>
    </div>
    )
  }
  return (
    <div className="py-1 px-3 w-full">
      <label className="block text-sm font-semibold text-gray-700 p-1">{label}</label>
      <input
        className="border-2 border-gray-200 rounded-lg w-full focus:outline-1 focus:outline-blue-100 px-2 py-1.5 text-md"
        {...props}
      />
    </div>
  );
}
