'use client';

import { register } from '@/actions/auth/controller';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';

import { isRedirectError } from 'next/dist/client/components/redirect';
import { toast } from 'sonner';

export default function SignUpForm() {
  const { isPending, mutate } = useMutation({
    mutationFn: register,
    onError: (error) => {
      if (isRedirectError(error)) {
        return;
      }
      toast.error(error.message, {
        richColors: true,
        duration: 5000,
        closeButton: true,
      });
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    mutate({ name, email, password });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 mb-6">
        <Label className="flex flex-col gap-2">
          Name
          <Input
            disabled={isPending}
            required
            type="text"
            name="name"
            placeholder="John Doe"
          />
        </Label>
        <Label className="flex flex-col gap-2">
          Email
          <Input
            disabled={isPending}
            required
            type="email"
            name="email"
            placeholder="name@example.com"
          />
        </Label>
        <Label className="flex flex-col gap-2">
          Password
          <PasswordInput
            minLength={6}
            disabled={isPending}
            required
            name="password"
          />
        </Label>
      </div>

      <LoadingButton isLoading={isPending} className="w-full font-medium">
        Create
      </LoadingButton>
    </form>
  );
}
