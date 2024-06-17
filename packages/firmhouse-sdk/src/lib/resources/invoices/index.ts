import { BaseResource } from '../BaseResource';
import * as Types from '../../graphql/generated';
import { PaymentTypeEnum, InvoiceStatusEnum } from '../../graphql/generated';
import { AllInvoicesDocument } from './allInvoices.generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { FirmhouseInvoice, PaginatedResponse } from '../../firmhouse';

/**
 * @public
 * You can use invoices to access all invoices in your project
 */
export class InvoicesResource extends BaseResource {
  /**
   * Retrieve Invoices
   * @param params - Parameters to filter invoices by
   * @param includeRelations - Relations to include in the response
   * @returns List of invoices with pagination info
   */
  public async fetchAll(
    params?: {
      /**
       * List invoices that are invoiced since the given date time.
       * @example
       * 2024-01-15T00:00:00+01:00
       */
      invoicedSince?: string | null;
      /**
       * List invoices that are invoiced until the given date time.
       * @example
       * 2024-01-15T00:00:00+01:00
       */
      invoicedUntil?: string | null;
      /**
       * List invoices that are updated since the given date time.
       * @example
       * 2024-01-15T00:00:00+01:00
       */
      updatedSince?: string | null;
      /**
       * List invoices that are updated until the given date time.
       * @example
       * 2024-01-15T00:00:00+01:00
       */
      updatedUntil?: string | null;
      /**
       * Only list invoices for the subscription with the given ID
       */
      subscriptionId?: string | null;
      /**
       * Only list invoices with the given payment types
       */
      paymentTypes?: PaymentTypeEnum[] | PaymentTypeEnum | null;
      /**
       * Only list invoices with the given statuses
       */
      statuses?: InvoiceStatusEnum[] | InvoiceStatusEnum | null;
      /**
       * Return the elements in the list that come after the specified cursor.
       */
      after?: string | null;
      /**
       * Return the elements in the list that come before the specified cursor
       */
      before?: string | null;
      /**
       * Return the last n elements from the list.
       */
      last?: number | null;
      /**
       * Return the first n elements from the list
       */
      first?: number | null;
    },
    includeRelations?: {
      /**
       * Include collectionCases relation
       */
      collectionCases?: boolean;
      /**
       * Include invoiceReminders relation
       */
      invoiceReminders?: boolean;
      /**
       * Include invoiceLineItems relation
       */
      invoiceLineItems?: boolean;
      /**
       * Include payment relation
       */
      payment?: boolean;
      /**
       * Include originalInvoice relation
       */
      originalInvoice?: boolean;
    }
  ): Promise<PaginatedResponse<FirmhouseInvoice>> {
    const response = await this._client.request(AllInvoicesDocument, {
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
      results: arrayFilterNulls(response.invoices?.nodes) as FirmhouseInvoice[],
    };
  }
}
