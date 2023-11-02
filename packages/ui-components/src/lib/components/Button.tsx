export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
}

export function Button({ onClick, className, text, ...rest }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 bg-black text-white rounded-2xl ${className ?? ''}`}
      {...rest}
    >
      {text}
    </button>
  );
}
