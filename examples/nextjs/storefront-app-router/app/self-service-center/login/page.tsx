import { firmhouseClient } from '../../../lib/firmhouse';
import { SelfServiceCenterLoginForm } from '@firmhouse/ui-components';
import { RedirectType, redirect } from 'next/navigation';

export default async function Login() {
  async function onSubmit(email: string) {
    'use server';

    try {
      await firmhouseClient.selfServiceCenterToken.create(
        email,
        `${process.env.NEXT_PUBLIC_SITE_URL}/self-service-center/token-login`
      );
    } catch (e) {
      console.error(e);
    }
    redirect('/self-service-center/status', RedirectType.replace);
  }

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
