import { Button, ButtonProps } from './button';
import { LoaderCircle } from 'lucide-react';

export type LoadingButtonProps = ButtonProps & {
  isLoading?: boolean;
  position?: 'start' | 'end';
};

export const LoadingButton = ({
  children,
  isLoading,
  position = 'start',
  disabled,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {position === 'start' && isLoading && (
        <LoaderCircle className="animate-spin" />
      )}
      {children}
      {position === 'end' && isLoading && (
        <LoaderCircle className="animate-spin" />
      )}
    </Button>
  );
};
