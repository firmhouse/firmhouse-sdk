import Link from 'next/link';

export default async function Status() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md justify-center text-center">
        <h2 className="mt-6 text-center text-3xl text-gray-900 leading-tight">
          We&apos;ve sent a login link to your email address
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 text-sm">
          <span className="block text-gray-700">
            <b className="block">
              If your email address is found in our system you will shortly
              receive an email with a login link.
            </b>
            The link expires within 30 minutes, so please click it soon.
          </span>
        </div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-4">
        Haven&apos;t received an email?
        <Link
          className="font-medium text-accent-600 hover:underline block"
          href="/self-service-center/login"
        >
          Try again with a different email address.
        </Link>
      </p>
    </div>
  );
}
