'use client';

import { LoadingButton } from '@/components/ui/loading-button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Token } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/actions/auth/controller';

export default function ChangePasswordForm({
  token,
}: {
  token: Token['token'];
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newPassword = data.get('newPassword') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords must be the same');
      return;
    }

    mutate({ newPassword, token });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 mb-6">
        <Label className="flex flex-col gap-2">
          New password
          <PasswordInput
            disabled={isPending}
            required
            autoComplete="new-password"
            placeholder="Enter new password"
            name="newPassword"
          />
        </Label>
        <Label className="flex flex-col gap-2">
          Confirm password
          <PasswordInput
            disabled={isPending}
            minLength={6}
            required
            autoComplete="new-password"
            placeholder="Confirm new password"
            name="confirmPassword"
          />
        </Label>
      </div>

      <LoadingButton isLoading={isPending} className="w-full font-medium">
        Change
      </LoadingButton>
    </form>
  );
}
