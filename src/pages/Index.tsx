import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Target, Compass, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen gradient-warm">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-12 flex justify-center">
            <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-large">
              <Compass className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="font-bold mb-8 gradient-primary bg-clip-text text-transparent leading-tight">
            Align
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
            Discover your ideal college major through personalized questions that reveal your interests, skills, and aspirations
          </h2>
          
          {/* Additional description */}
          <p className="text-lg text-muted-foreground/80 mb-16 max-w-2xl mx-auto leading-relaxed">
            Take our comprehensive questionnaire and get matched with majors that align with your unique profile
          </p>
          
          {/* CTA Button */}
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="gradient-primary text-white px-12 py-8 text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-large hover:shadow-xl border-0"
          >
            <Target className="w-6 h-6 mr-3" />
            Get Started
          </Button>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <Card className="p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-primary/10 rounded-2xl bg-white/80 backdrop-blur-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Personalized Matching</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our algorithm analyzes your responses to suggest majors that fit your personality and goals
            </p>
          </Card>
          
          <Card className="p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-orange-accent/10 rounded-2xl bg-white/80 backdrop-blur-sm">
            <div className="w-16 h-16 bg-orange-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Compass className="w-8 h-8 text-orange-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Career Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Learn about potential career paths and opportunities for each recommended major
            </p>
          </Card>
          
          <Card className="p-8 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-success/10 rounded-2xl bg-white/80 backdrop-blur-sm">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Trusted by Students</h3>
            <p className="text-muted-foreground leading-relaxed">
              Join thousands of students who found their perfect academic path through Align
            </p>
          </Card>
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 py-12 border-t border-border/50">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Major Options</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-accent mb-2">5 min</div>
              <div className="text-muted-foreground">Quick Assessment</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
