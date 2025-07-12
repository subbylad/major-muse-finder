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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Compass className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-accent bg-clip-text text-transparent">
            Align
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
            Discover your ideal college major through personalized questions that reveal your interests, skills, and aspirations
          </p>
          
          {/* Additional description */}
          <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto">
            Take our comprehensive questionnaire and get matched with majors that align with your unique profile
          </p>
          
          {/* CTA Button */}
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Target className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personalized Matching</h3>
            <p className="text-muted-foreground text-sm">
              Our algorithm analyzes your responses to suggest majors that fit your personality and goals
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-orange-accent/10">
            <div className="w-12 h-12 bg-orange-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-orange-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Insights</h3>
            <p className="text-muted-foreground text-sm">
              Learn about potential career paths and opportunities for each recommended major
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-success/10">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Trusted by Students</h3>
            <p className="text-muted-foreground text-sm">
              Join thousands of students who found their perfect academic path through Align
            </p>
          </Card>
        </div>
        
        {/* Stats Section */}
        <div className="mt-16 py-8 border-t border-border/50">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Major Options</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-accent">5 min</div>
              <div className="text-sm text-muted-foreground">Quick Assessment</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">95%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
