import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FeatureCard, Navigation } from "@/components/optimized/OptimizedComponents";
import { GraduationCap, Target, Compass, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session using optimized auth utility
    const checkSession = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleGetStarted = useCallback(() => {
    if (user) {
      navigate("/questionnaire");
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
    }
  }, [toast]);

  // Memoized computed values
  const isAuthenticated = useMemo(() => !!user, [user]);
  const buttonText = useMemo(() => user ? "Continue" : "Get Started", [user]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {!isLoading && (
        <div className="container mx-auto px-8 py-8">
          <Navigation
            isAuthenticated={isAuthenticated}
            onNavigate={handleNavigate}
            onSignOut={handleSignOut}
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-8 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal mb-12 text-foreground leading-none tracking-tight">
            Align
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed font-normal">
            A thoughtful questionnaire to help you find your ideal college major
          </p>
          
          {/* CTA Button - Minimal design */}
          <Button 
            onClick={handleGetStarted}
            className="bg-primary text-primary-foreground px-8 py-4 text-lg font-normal rounded-lg transition-all duration-200 hover:bg-primary/90 border-0"
            disabled={isLoading}
          >
            {buttonText}
          </Button>
        </div>
        
        {/* Feature Grid - Minimal design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-normal mb-4 text-foreground">Personalized</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Recommendations tailored to your unique interests and goals
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-normal mb-4 text-foreground">Insightful</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Detailed career paths and opportunities for each major
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-normal mb-4 text-foreground">Trusted</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Used by thousands of students to find their path
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
