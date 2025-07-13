import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Target, Compass, Users, History, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
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

  const handleGetStarted = () => {
    if (user) {
      navigate("/questionnaire");
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
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
  };

  return (
    <div className="min-h-screen gradient-warm">
      {/* Navigation */}
      {!isLoading && (
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-end gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/history")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 sm:mb-12 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-large">
              <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 text-primary leading-tight">
            Align
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl text-muted-foreground mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Discover your ideal college major through personalized questions that reveal your interests, skills, and aspirations
          </h2>
          
          {/* Additional description */}
          <p className="text-base sm:text-lg text-muted-foreground/80 mb-12 sm:mb-16 max-w-2xl mx-auto leading-relaxed px-4">
            Take our comprehensive questionnaire and get matched with majors that align with your unique profile
          </p>
          
          {/* CTA Button - Enhanced with micro-interactions */}
          <Button 
            onClick={handleGetStarted}
            className="w-full sm:w-auto min-h-[56px] sm:min-h-[64px] gradient-primary text-white px-8 sm:px-12 py-4 sm:py-8 text-lg sm:text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-large hover:shadow-xl border-0 touch-manipulation ripple"
            disabled={isLoading}
          >
            <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            {user ? "Continue Journey" : "Get Started"}
          </Button>
        </div>
        
        {/* Feature Cards - Enhanced with micro-interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-24 max-w-5xl mx-auto">
          <Card className="p-6 sm:p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-98 border-primary/10 rounded-2xl bg-white/80 backdrop-blur-sm cursor-pointer group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">Personalized Matching</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Our algorithm analyzes your responses to suggest majors that fit your personality and goals
            </p>
          </Card>
          
          <Card className="p-6 sm:p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-98 border-orange-accent/10 rounded-2xl bg-white/80 backdrop-blur-sm cursor-pointer group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-orange-accent/20 transition-all duration-300 group-hover:scale-110">
              <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-orange-accent group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-orange-accent transition-colors duration-300">Career Insights</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Learn about potential career paths and opportunities for each recommended major
            </p>
          </Card>
          
          <Card className="p-6 sm:p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-98 border-success/10 rounded-2xl bg-white/80 backdrop-blur-sm sm:col-span-2 md:col-span-1 cursor-pointer group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-success/20 transition-all duration-300 group-hover:scale-110">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-success group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-success transition-colors duration-300">Trusted by Students</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Join thousands of students who found their perfect academic path through Align
            </p>
          </Card>
        </div>
        
        {/* Stats Section - Mobile Optimized */}
        <div className="mt-16 sm:mt-20 py-8 sm:py-12 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto text-center">
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Major Options</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-bold text-orange-accent mb-1 sm:mb-2">5 min</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Quick Assessment</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-bold text-success mb-1 sm:mb-2">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
