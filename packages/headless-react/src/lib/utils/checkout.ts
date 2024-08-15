import { FirmhouseCart } from '@firmhouse/firmhouse-sdk';

export function getCheckoutDetailsFromForm(
  event: React.FormEvent<HTMLFormElement>,
  cart: FirmhouseCart | null,
  differentBillingAddress: boolean,
  fields: string[]
) {
  const formData = new FormData(event.currentTarget);
  const addressDetails: Record<
    string,
    string | boolean | { id?: string; extraFieldId: string; value: string }
  > = {};
  const billingFields =
    fields.filter((field) => field.startsWith('billTo')) ?? [];
  const extraFields = fields.filter((field) => isExtraField(field)) ?? [];
  const regularFields =
    fields.filter(
      (field) => !field.startsWith('billTo') && !isExtraField(field)
    ) ?? [];

  const allFields = regularFields;

  if (differentBillingAddress) {
    allFields.push(...(billingFields ?? []));
  }

  allFields.forEach((field) => {
    addressDetails[field] =
      field === 'differentBillingAddress'
        ? differentBillingAddress
        : (formData.get(field) as string); // Assign values to addressDetails properties
  });
  console.log(extraFields);
  extraFields.forEach((field) => {
    const existingAnswerId = cart?.extraFields?.find(
      (extraField) => extraField.extraFieldId === field
    )?.id;
    const answer = {
      extraFieldId: field,
      value: (formData.get(field) as string) ?? '',
    };
    addressDetails['extraFields'] = existingAnswerId
      ? {
          id: existingAnswerId,
          ...answer,
        }
      : answer;
  });

  return addressDetails;
}

export function isExtraField(field: string) {
  return !!field.match(/^[0-9]+$/);
}
