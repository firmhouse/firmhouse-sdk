import { firmhouseClient } from '../../lib/firmhouse';
import SelfServiceCenterLoginForm from '../../components/SelfServiceCenterLoginForm';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const onSubmit = (email: string) => {
    firmhouseClient.selfServiceCenterToken
      .create(email)
      .catch((e) => console.error(e));
    router.replace('/self-service-center/status');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md justify-center text-center">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 leading-tight">
          Sign in to manage your subscription
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SelfServiceCenterLoginForm createSelfServiceToken={onSubmit} />
      </div>
    </div>
  );
}
