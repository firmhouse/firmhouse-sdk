export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  hideButtons?: boolean;
}

export function NumberInput({
  onChange,
  value,
  hideButtons,
}: NumberInputProps) {
  return (
    <div
      className={`border border-gray-400 rounded-3xl px-1 flex items-center justify-center w-full max-w-[4em]`}
    >
      {!hideButtons && (
        <button
          className="text-lg px-0.5 font-semibold disabled:text-gray-300"
          onClick={() => onChange(value - 1)}
          disabled={value === 1}
        >
          -
        </button>
      )}
      <input
        className="[appearance:textfield] w-full bg-transparent focus:outline-none text-center font-light"
        type="number"
        onChange={(e) => onChange(Number(e.target.value) ?? 0)}
        value={value}
      />
      {!hideButtons && (
        <button
          className="text-lg px-0.5 font-semibold"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      )}
    </div>
  );
}
