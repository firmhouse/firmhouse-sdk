import { BaseResource } from '../BaseResource';
import * as Types from '../../graphql/generated';
import { PaymentTypeEnum, InvoiceStatusEnum } from '../../graphql/generated';
import { AllInvoicesDocument } from './allInvoices.generated';
import { arrayFilterNulls } from '../../helpers/utils';
import { FirmhouseInvoice, PaginatedResponse } from '../../firmhouse';

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
    params?: Types.Exact<{
      invoicedSince?: Types.InputMaybe<
        Types.Scalars['ISO8601DateTime']['input']
      >;
      invoicedUntil?: Types.InputMaybe<
        Types.Scalars['ISO8601DateTime']['input']
      >;
      updatedSince?: Types.InputMaybe<
        Types.Scalars['ISO8601DateTime']['input']
      >;
      updatedUntil?: Types.InputMaybe<
        Types.Scalars['ISO8601DateTime']['input']
      >;
      subscriptionId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
      paymentTypes?: Types.InputMaybe<Array<PaymentTypeEnum> | PaymentTypeEnum>;
      statuses?: Types.InputMaybe<Array<InvoiceStatusEnum> | InvoiceStatusEnum>;
      after?: Types.InputMaybe<Types.Scalars['String']['input']>;
      before?: Types.InputMaybe<Types.Scalars['String']['input']>;
      last?: Types.InputMaybe<Types.Scalars['Int']['input']>;
      first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
    }>,
    includeRelations?: {
      collectionCases?: boolean;
      invoiceReminders?: boolean;
      invoiceLineItems?: boolean;
      payment?: boolean;
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
