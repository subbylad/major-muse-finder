import { memo } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

// Memoized Button component to prevent unnecessary re-renders
// when parent components re-render but button props haven't changed
export const MemoizedButton = memo<ButtonProps>(({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
});

MemoizedButton.displayName = 'MemoizedButton';