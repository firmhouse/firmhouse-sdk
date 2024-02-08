'use client';

import dayjs from 'dayjs';
import { useState, useTransition } from 'react';

export interface ShipmentDateFormProps {
  shipmentDate: string | null;
  updateShipment: (data: FormData) => void;
}

export default function ShipmentDateForm({
  shipmentDate,
  updateShipment,
}: ShipmentDateFormProps) {
  const [isPending, startTransition] = useTransition();
  const [newShipmentDate, setNewShipmentDate] = useState(shipmentDate);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const data = new FormData();
          data.append('shipmentDate', newShipmentDate ?? '');
          return updateShipment(data);
        });
      }}
    >
      <label className="block text-sm font-bold mb-2 mt-3">
        <input
          type="date"
          name="shipmentDate"
          onChange={(e) => setNewShipmentDate(e.target.value)}
          min={dayjs().add(1, 'day').format('YYYY-MM-DD')}
          required
          className="form-input bg-transparent z-50 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 form-input-public cursor-pointer rounded-md border-gray-400 focus:border-blue-300 focus:ring-blue-200 focus:ring-opacity-50 sm:w-auto border shadow-none focus:border-accent focus:outline-none focus:shadow-none focus:ring-0"
        />
      </label>
      <div className="flex flex-row-reverse mt-2">
        <button
          type="submit"
          disabled={isPending || newShipmentDate === shipmentDate}
          className="bg-gray-900 text-gray-50 rounded-md p-2 my-4 leading-6 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-400 disabled:hover:bg-gray-200 disabled:hover:text-gray-600"
        >
          Adjust
        </button>
      </div>
    </form>
  );
}
