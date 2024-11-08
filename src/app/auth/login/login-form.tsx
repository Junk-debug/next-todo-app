'use client';

import { login } from '@/actions/user';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onError: (error) => {
      console.log(error);
      toast.error(error.message, {
        richColors: true,
        duration: 5000,
        closeButton: true,
      });
    },
    onSuccess: () => {
      const callbackUrl = searchParams.get('callbackUrl');

      if (callbackUrl) {
        console.log('callbackUrl: ', callbackUrl);
        router.push(new URL(callbackUrl).toString());
      } else {
        router.push('/home');
      }
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    mutate({ email, password });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 mb-6">
        <Label className="flex flex-col gap-2">
          Email
          <Input
            required
            type="email"
            name="email"
            placeholder="name@example.com"
          />
        </Label>
        <Label className="flex flex-col gap-2">
          Password
          <Input required type="password" name="password" />
        </Label>
      </div>

      <LoadingButton
        type="submit"
        isLoading={isPending}
        className="w-full font-medium"
      >
        Sign in
      </LoadingButton>
    </form>
  );
}
