export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function NumberInput({ onChange, value }: NumberInputProps) {
  return (
    <div className="border border-gray-400 rounded-3xl px-1 flex items-center justify-center w-full max-w-[4em]">
      <button className="text-lg px-0.5 font-semibold disabled:text-gray-300" onClick={() => onChange(value - 1)} disabled={value === 1}>-</button>
      <input
        className="[appearance:textfield] w-full focus:outline-none text-center font-light"
        type="number"
        onChange={(e) => onChange(Number(e.target.value) ?? 0)}
        value={value}
      />
      <button className="text-lg px-0.5 font-semibold" onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
