import React from 'react';

export interface PillProps extends React.BaseHTMLAttributes<HTMLSpanElement> {
  text: string;
  color: string;
  icon?: React.ReactNode;
}

function classNameForColor(color: string) {
  switch (color) {
    case 'blue':
      return 'bg-black text-white';
    case 'indigo':
      return 'bg-indigo-100 text-indigo-700';
    case 'orange':
      return 'bg-orange-100 text-orange-800';
    case 'pink':
      return 'bg-pink-100 text-pink-800';
    case 'green':
      return 'bg-green-100 text-green-800';
    case 'red':
      return 'bg-red-100 text-red-800';
    case 'darkred':
      return 'bg-red-700 text-white';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800';
    case 'gray':
      return 'bg-gray-300 text-gray-800';
    default:
      return '';
  }
}

export function Pill({ color, text, icon, ...rest }: PillProps) {
  return (
    <span
      className={`capitalize items-center px-2 py-1 rounded-full text-xs font-medium leading-4 mr-2 ${classNameForColor(
        color
      )}`}
      {...rest}
    >
      {icon && icon}
      {text}
    </span>
  );
}
