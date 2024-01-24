import { writeAccessFirmhouseClient } from '../../../../../lib/firmhouse-write';
import { getSSCSubscriptionToken } from '../../../../../lib/actions/subscription';

import Invoice from './Invoice';
import { InvoiceType } from '@firmhouse/firmhouse-sdk';

export default async function Invoices() {
  const token = await getSSCSubscriptionToken();
  const firmhouseClient = await writeAccessFirmhouseClient();
  const subscription = await firmhouseClient.subscriptions.get(token);
  const { results: invoices } = await firmhouseClient.invoices.fetchAll(
    { subscriptionId: subscription.id },
    { originalInvoice: true }
  );
  const creditInvoices = invoices.reduce((result, invoice) => {
    if (invoice.originalInvoice) {
      result[invoice.originalInvoice.id] = invoice;
    }
    return result;
  }, {} as Record<string, InvoiceType>);

  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs">
        <div className="container mx-auto max-w-2xl pt-16 pb-8 -mb-8">
          <div className="mb-5 mt-12">
            <h1 className="text-2xl font-semibold">Your invoices</h1>
            <p className="text-sm opacity-75">
              An overview of all your invoices
            </p>
          </div>
        </div>
      </div>
      <div className="container max-w-2xl mx-auto p-4">
        {invoices.map((invoice) => (
          <Invoice
            key={`invoice-${invoice.invoiceNumber}`}
            invoice={invoice}
            creditInvoice={creditInvoices[invoice.id]}
          />
        ))}
      </div>
    </>
  );
}
