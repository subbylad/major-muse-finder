import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AppHeader = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser().then(setUser);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleHomeClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  }, [navigate, user]);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, navigate]);

  // Don't show header on auth page or index page
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null;
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleHomeClick}
          className="text-muted-foreground hover:text-foreground font-normal"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate('/history')}
                className="text-muted-foreground hover:text-foreground font-normal"
              >
                History
              </Button>
              <Button
                variant="ghost"
                onClick={handleProfileClick}
                className="text-muted-foreground hover:text-foreground font-normal"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground font-normal"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="text-muted-foreground hover:text-foreground font-normal"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};