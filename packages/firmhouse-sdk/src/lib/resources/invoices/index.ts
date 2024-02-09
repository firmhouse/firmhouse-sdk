import { BaseResource } from '../BaseResource';
import {
  AllInvoicesDocument,
  AllInvoicesQuery,
  AllInvoicesQueryVariables,
} from './allInvoices.generated';
import { arrayFilterNulls } from '../../helpers/utils';

export type { AllInvoicesQuery, AllInvoicesQueryVariables };

/**
 * @public
 * Invoice
 */
export type InvoiceType = NonNullable<
  NonNullable<NonNullable<AllInvoicesQuery['invoices']>['nodes']>[0]
>;

/**
 * @public
 * Invoice methods
 */
export class InvoicesResource extends BaseResource {
  /**
   * Retrieve Invoices
   * @param params - Parameters to filter invoices by
   * @param includeRelations - Relations to include in the response
   * @returns List of invoices with pagination info
   */
  public async fetchAll(
    params?: Omit<
      AllInvoicesQueryVariables,
      | 'includeCollectionCases'
      | 'includeInvoiceReminders'
      | 'includeInvoiceLineItems'
      | 'includePayment'
      | 'includeOriginalInvoice'
    >,
    includeRelations?: {
      collectionCases?: boolean;
      invoiceReminders?: boolean;
      invoiceLineItems?: boolean;
      payment?: boolean;
      originalInvoice?: boolean;
    }
  ) {
    const response = await this.client.request(AllInvoicesDocument, {
      ...(params ?? {}),
      includeCollectionCases: includeRelations?.collectionCases ?? false,
      includeInvoiceReminders: includeRelations?.invoiceReminders ?? false,
      includeInvoiceLineItems: includeRelations?.invoiceLineItems ?? false,
      includePayment: includeRelations?.payment ?? false,
      includeOriginalInvoice: includeRelations?.originalInvoice ?? false,
    });
    return {
      total: response.invoices?.totalCount ?? 0,
      pageInfo: response.invoices?.pageInfo,
      results: arrayFilterNulls(response.invoices?.nodes),
    };
  }
}
