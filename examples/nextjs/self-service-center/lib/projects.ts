import dayjs from 'dayjs';
export enum Project {
  OrderBased = 'order',
  PlanBased = 'plan',
}

export function calculateExpectedDeliveryDate(shipmentDate: string) {
  return dayjs(shipmentDate).add(3, 'day').toDate();
}
