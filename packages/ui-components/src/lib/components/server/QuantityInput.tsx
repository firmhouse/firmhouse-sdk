export interface QuantityInputProps {
  id: string;
  quantity?: number;
  onUpdateQuantity: (data: FormData) => void;
}

export async function QuantityInput({
  id,
  quantity = 0,
  onUpdateQuantity,
}: QuantityInputProps) {
  return (
    <div className="border border-gray-400 rounded-3xl px-1 flex items-center justify-center w-full max-w-[4em]">
      <form action={onUpdateQuantity}>
        <input type="hidden" name="orderedProductId" value={id} readOnly/>
        <input type="hidden" name="quantity" value={quantity - 1} readOnly/>
        <button
          className="text-lg px-0.5 font-semibold disabled:text-gray-300"
          type="submit"
          disabled={quantity === 1}
        >
          -
        </button>
      </form>
      <input
        className="[appearance:textfield] w-full focus:outline-none text-center font-light"
        type="number"
        value={quantity}
        readOnly
      />
      <form action={onUpdateQuantity}>
        <input type="hidden" name="orderedProductId" value={id} readOnly/>
        <input type="hidden" name="quantity" value={quantity + 1} readOnly/>
        <button
          className="text-lg px-0.5 font-semibold disabled:text-gray-300"
          type="submit"
        >
          +
        </button>
      </form>
    </div>
  );
}
