import { memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Memoized Card components
export const MemoizedCard = memo(Card);
export const MemoizedCardContent = memo(CardContent);
export const MemoizedCardHeader = memo(CardHeader);
export const MemoizedCardTitle = memo(CardTitle);

// Feature card component with memoization
interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
}

export const FeatureCard = memo<FeatureCardProps>(({ icon: Icon, title, description, onClick }) => {
  return (
    <MemoizedCard 
      className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-all duration-200 cursor-pointer" 
      onClick={onClick}
    >
      <MemoizedCardContent className="p-0">
        <div className="flex flex-col items-center text-center space-y-4">
          <Icon className="w-12 h-12 text-foreground" />
          <div>
            <h3 className="text-lg font-normal text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
          </div>
        </div>
      </MemoizedCardContent>
    </MemoizedCard>
  );
});

FeatureCard.displayName = 'FeatureCard';

// Navigation component with memoization
interface NavigationProps {
  isAuthenticated: boolean;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export const Navigation = memo<NavigationProps>(({ isAuthenticated, onNavigate, onSignOut }) => {
  const handleHistoryClick = useCallback(() => onNavigate('/history'), [onNavigate]);
  const handleProfileClick = useCallback(() => onNavigate('/profile'), [onNavigate]);
  const handleAuthClick = useCallback(() => onNavigate('/auth'), [onNavigate]);

  return (
    <div className="flex justify-end gap-6">
      {isAuthenticated ? (
        <>
          <Button
            variant="ghost"
            onClick={handleHistoryClick}
            className="text-muted-foreground hover:text-foreground transition-colors font-normal"
          >
            History
          </Button>
          <Button
            variant="ghost"
            onClick={handleProfileClick}
            className="text-muted-foreground hover:text-foreground transition-colors font-normal"
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-foreground transition-colors font-normal"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          onClick={handleAuthClick}
          className="text-muted-foreground hover:text-foreground transition-colors font-normal"
        >
          Sign In
        </Button>
      )}
    </div>
  );
});

Navigation.displayName = 'Navigation';