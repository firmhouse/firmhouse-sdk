'use client';

import { OrderedProductIntervalUnitOfMeasure } from '@firmhouse/firmhouse-sdk';
import { useState, useTransition } from 'react';

export interface CustomFrequencyProps {
  unitOfMeasure?: OrderedProductIntervalUnitOfMeasure | null;
  interval?: number | null;
  frequency: string;
  updateInterval: (data: FormData) => void;
}

export default function CustomFrequency(props: CustomFrequencyProps) {
  const [unitOfMeasure, setUnitOfMeasure] = useState(
    props.unitOfMeasure ?? OrderedProductIntervalUnitOfMeasure.Default
  );
  const [customInterval, setCustomInterval] = useState(props.interval ?? 1);
  const visible = unitOfMeasure !== OrderedProductIntervalUnitOfMeasure.Default;
  const [isPending, startTransition] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const data = new FormData();
          data.append('interval', customInterval.toString());
          data.append('unitOfMeasure', unitOfMeasure);
          return props.updateInterval(data);
        });
      }}
    >
      <div className="mt-3 text-sm">
        <div className="bg-gray-200 rounded p-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="unitOfMeasure"
              value={OrderedProductIntervalUnitOfMeasure.Default}
              checked={
                unitOfMeasure === OrderedProductIntervalUnitOfMeasure.Default
              }
              onChange={() => {
                setUnitOfMeasure(OrderedProductIntervalUnitOfMeasure.Default);
                setCustomInterval(props.interval ?? 1);
              }}
            />
            <div>
              <span className="block">
                {props.frequency ? `Every ${props.frequency}` : 'Once'}
                (Recommended)
              </span>
            </div>
          </label>
        </div>
        <div className="bg-gray-200 rounded p-4 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="unitOfMeasure"
              value={unitOfMeasure?.toString() ?? ''}
              checked={visible}
              onChange={() =>
                setUnitOfMeasure(OrderedProductIntervalUnitOfMeasure.Months)
              }
            />
            <span>Use custom frequency</span>
          </label>
          {visible && (
            <div className="flex mt-3 items-center">
              <input
                type="number"
                className="form-input rounded-r-none rounded-md border-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:w-auto w-1/3 lg:w-1/6"
                value={customInterval}
                min={1}
                required={true}
                onChange={(e) => setCustomInterval(parseInt(e.target.value))}
              />
              <select
                className="form-select ounded-md border-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:w-auto rounded-l-none rounded-md border-l-0 w-2/3 lg:w-auto"
                name=""
                value={
                  unitOfMeasure ?? OrderedProductIntervalUnitOfMeasure.Months
                }
                onChange={(e) =>
                  setUnitOfMeasure(
                    e.target.value as OrderedProductIntervalUnitOfMeasure
                  )
                }
                required={true}
              >
                <option value={OrderedProductIntervalUnitOfMeasure.Days}>
                  Days
                </option>
                <option value={OrderedProductIntervalUnitOfMeasure.Weeks}>
                  Weeks
                </option>
                <option value={OrderedProductIntervalUnitOfMeasure.Months}>
                  Months
                </option>
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row-reverse mt-2">
        <button
          type="submit"
          disabled={
            isPending ||
            (customInterval === props.interval &&
              unitOfMeasure === props.unitOfMeasure)
          }
          className="bg-gray-900 text-gray-50 rounded-md p-2 my-4 leading-6 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-400 disabled:hover:bg-gray-200 disabled:hover:text-gray-600"
        >
          Adjust
        </button>
      </div>
    </form>
  );
}
