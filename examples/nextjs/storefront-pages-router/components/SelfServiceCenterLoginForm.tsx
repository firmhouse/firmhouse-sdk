import { Button, Input } from '@firmhouse/ui-components';
import { useState } from 'react';

export interface SelfServiceCenterLoginFormProps {
  createSelfServiceToken: (email: string) => void;
  error?: string;
}

export default function SelfServiceCenterLoginForm({
  createSelfServiceToken,
  error,
}: SelfServiceCenterLoginFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const onSubmit = () => {
    setLoading(true);
    createSelfServiceToken(email);
  };

  return (
    <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
      <form
        onSubmit={onSubmit}
        className="[&>div>label]:font-normal [&>div]:px-0"
      >
        <Input
          error={error}
          onChange={(e) => setEmail(e.target.value)}
          label="Enter the email address associated with your subscription"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
        />
        <Button
          type="submit"
          className=" w-full py-2 my-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          text="Sign in with E-mail"
          disabled={email.length === 0 || loading}
        />
      </form>
      <p className="text-center text-gray-800 text-sm">
        We&apos;ll email you a login link for a password-free sign in.
      </p>
    </div>
  );
}
