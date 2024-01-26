import { writeAccessFirmhouseClient } from '../../../../lib/firmhouse-write';
import { getSSCSubscriptionToken } from '../../../../lib/actions/subscription';

import Invoice from '../../../../components/Invoice';
import { InvoiceType } from '@firmhouse/firmhouse-sdk';
import { Header } from '../Header';

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
      <Header title="Your invoices" byline="An overview of all your invoices" />

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
