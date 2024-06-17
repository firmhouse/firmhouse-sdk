import { ReactComponent as CreditCard } from '../../assets/payment-methods/creditcard.svg';
import { ReactComponent as DirectDebit } from '../../assets/payment-methods/directdebit.svg';
import { ReactComponent as Ideal } from '../../assets/payment-methods/ideal.svg';
import { ReactComponent as Sofort } from '../../assets/payment-methods/sofort.svg';
import { ReactComponent as WeChatPay } from '../../assets/payment-methods/wechatpay.svg';

export interface PaymentMethodIconProps {
  paymentMethod?: string;
}

export async function PaymentMethodIcon({
  paymentMethod,
}: PaymentMethodIconProps) {
  switch (paymentMethod) {
    case 'credit_card':
      return <CreditCard />;
    case 'ideal':
      return <Ideal />;
    case 'sepa_debit':
    case 'sepa_credit_debit':
      return <DirectDebit />;
    case 'sofort':
      return <Sofort />;
    case 'wechatpay':
      return <WeChatPay />;
    default:
      return null;
  }
}
