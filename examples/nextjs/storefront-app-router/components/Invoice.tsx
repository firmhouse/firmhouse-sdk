import { InvoiceType } from '@firmhouse/firmhouse-sdk';
import { Chevron } from '@firmhouse/ui-components';
import {
  Pill,
  PillProps,
  formatShortDate,
  formatCentsWithCurrency,
} from '@firmhouse/ui-components';

export interface InvoiceProps {
  invoice: InvoiceType;
  creditInvoice?: InvoiceType;
  inline?: boolean;
}

function pillPropsForInvoice(
  invoice: InvoiceType,
  creditInvoice?: InvoiceType
): PillProps {
  if (invoice.originalInvoice?.status === 'refunded') {
    return pillPropsForInvoice(invoice.originalInvoice, invoice);
  }
  if (creditInvoice) {
    return {
      text: 'Credited',
      color: 'green',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="inline w-3 mr-1"
        >
          <path
            fillRule="evenodd"
            d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
  }
  switch (invoice.status) {
    case 'cancelled':
      return { text: 'Cancelled', color: 'red' };
    case 'failed':
      return { text: 'Failed', color: 'red' };
    case 'expired':
      return { text: 'Expired', color: 'orange' };
    case 'paid':
      return { text: 'Paid', color: 'green' };
    case 'paidout':
      return { text: 'Paid out', color: 'green' };
    case 'refunded':
      return { text: 'Refunded', color: 'yellow' };
    case 'partially_refunded':
      return { text: 'Partially refunded', color: 'yellow' };
    default:
      return { text: invoice.status ?? '', color: 'gray' };
  }
}
export default function Invoice({
  invoice,
  creditInvoice,
  inline,
}: InvoiceProps) {
  const pills = (
    <>
      {creditInvoice && <Pill {...pillPropsForInvoice(invoice, undefined)} />}
      {!(
        invoice.originalInvoice &&
        invoice.originalInvoice?.status !== 'refunded'
      ) && <Pill {...pillPropsForInvoice(invoice, creditInvoice)} />}
    </>
  );
  return (
    <>
      <a
        href={invoice.detailsUrl ?? '#'}
        target="_blank"
        className={`flex justify-between flex-wrap items-center z-10 bg-white border p-4 mb-4 rounded-md cursor-pointer text-gray-900 no-underline relative  hover:text-gray-900 focus:bg-gray-200 focus:border-gray-400 focus:shadow-none focus:no-underline ${
          inline
            ? 'hover:border-gray-500 my-2'
            : 'shadow-md hover:border-gray-300 hover:shadow-lg'
        }`}
      >
        <div>
          {invoice.invoicedAt && (
            <p className={`text-xs ${inline ? '' : 'text-gray-600'}`}>
              {`#${invoice.invoiceNumber} on ${formatShortDate(
                invoice.invoicedAt
              )}`}
            </p>
          )}
          <div className="flex items-center">
            <p className="font-semibold">
              {formatCentsWithCurrency(
                invoice.totalAmountCents,
                invoice.currency ?? 'EUR',
                undefined,
                0
              )}
            </p>
          </div>
          {inline && <div className="mt-2">{pills}</div>}
        </div>
        <div className="ml-auto flex items-center">
          {!inline && pills}
          <Chevron className="h-7 text-gray" />
        </div>
      </a>
      {creditInvoice && creditInvoice.invoicedAt && (
        <div className="flex justify-between flex-wrap items-center border p-4 mb-4 rounded-md shadow-md text-gray-900 no-underline relative hover:border-gray-300 hover:shadow-lg hover:text-gray-900 focus:bg-gray-200 focus:border-gray-400 focus:shadow-none focus:no-underline -mt-7 pt-6 z-0 bg-gray-200 cursor-default">
          <p className="text-xs text-gray-600">
            {`Credited with #${
              creditInvoice.invoiceNumber
            } on ${formatShortDate(creditInvoice.invoicedAt)}`}
          </p>
          <div className="flex items-center">
            <p className="font-semibold">
              {formatCentsWithCurrency(
                creditInvoice.totalAmountCents,
                creditInvoice.currency ?? 'EUR'
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
