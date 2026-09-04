import Checkout from '../components/checkout';
import styles from './page.module.css';

export default async function Index() {
  const apiToken =
    process.env.NEXT_PUBLIC_FIRMHOUSE_HEADLESS_CHECKOUT_ACCESS_TOKEN;
  if (!apiToken) {
    throw new Error('Please provide a Firmhouse API token');
  }
  return (
    <div className={styles.page}>
      <Checkout apiToken={apiToken} />
    </div>
  );
}
