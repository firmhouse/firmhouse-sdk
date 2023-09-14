export interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export function Button({ onClick, text }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 bg-black text-white rounded-2xl"
    >
      {text}
    </button>
  );
}
