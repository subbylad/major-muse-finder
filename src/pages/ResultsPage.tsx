import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RotateCcw, Save, Trophy, Sparkles, Star, Award, Crown, Medal, PartyPopper, Share } from "lucide-react";
import { useEffect, useState } from "react";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [animateProgress, setAnimateProgress] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    // Trigger animations with delay for dramatic effect
    setTimeout(() => setAnimateProgress(true), 500);
    setTimeout(() => setShowCards(true), 1000);
  }, []);

  // Mock recommendations with enhanced data for celebration
  const recommendations = [
    {
      major: "Computer Science",
      match: 92,
      icon: Crown,
      achievement: "Tech Innovator",
      description: "Your strong technical skills, problem-solving abilities, and interest in technology make this an excellent fit. High earning potential and growing job market.",
      detailedExplanation: "You've demonstrated exceptional logical thinking and technical aptitude. Computer Science offers endless opportunities in AI, software development, cybersecurity, and emerging technologies.",
      reasons: ["High technical confidence", "Problem-solving strength", "Technology interest"],
      matchLevel: "Perfect Match",
      color: "from-success to-success/80"
    },
    {
      major: "Business Administration", 
      match: 87,
      icon: Trophy,
      achievement: "Future Leader",
      description: "Your leadership qualities, communication skills, and interest in career advancement align well with business studies. Versatile degree with many career paths.",
      detailedExplanation: "Your natural leadership abilities and strategic thinking make you perfect for business. This degree opens doors to management, entrepreneurship, consulting, and executive roles.",
      reasons: ["Leadership confidence", "Communication skills", "Career growth focus"],
      matchLevel: "Excellent Match",
      color: "from-primary to-primary/80"
    },
    {
      major: "Data Science",
      match: 81,
      icon: Medal,
      achievement: "Data Detective",
      description: "Combines your mathematical abilities with technology interests. Perfect for analytical minds who want to solve real-world problems with data.",
      detailedExplanation: "Your analytical mindset and mathematical skills are perfect for the data revolution. Help companies make decisions, predict trends, and solve complex problems through data analysis.",
      reasons: ["Math strengths", "Analytical thinking", "Technology focus"],
      matchLevel: "Great Match",
      color: "from-orange-accent to-orange-accent/80"
    }
  ];

  const handleRetakeQuiz = () => {
    navigate("/questionnaire");
  };

  const handleSaveResults = () => {
    toast({
      title: "🎉 Results saved!",
      description: "Your major recommendations have been saved to your profile.",
    });
    // TODO: Implement actual saving logic
  };

  const handleShare = () => {
    toast({
      title: "🚀 Ready to share!",
      description: "Share your career discovery with friends and family.",
    });
    // TODO: Implement sharing functionality
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 80) return "text-primary";
    return "text-orange-accent";
  };

  const getMatchBackground = (percentage: number) => {
    if (percentage >= 90) return "bg-success/10 border-success/20";
    if (percentage >= 80) return "bg-primary/10 border-primary/20";
    return "bg-orange-accent/10 border-orange-accent/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-orange-accent/10 p-4 relative overflow-hidden">
      {/* Floating celebration elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-success/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-orange-accent/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-purple-accent/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl relative">
        {/* Celebration Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative animate-scale-in">
              <div className="w-28 h-28 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center shadow-large">
                <PartyPopper className="w-14 h-14 text-success-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-accent to-orange-accent/70 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-orange-accent-foreground animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-primary-foreground animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-accent to-success bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>
            🎊 Your Career Journey Unlocked!
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Top Major Recommendations
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
            🌟 Congratulations! We've analyzed your unique strengths, interests, and goals to discover your perfect academic matches. These aren't just suggestions—they're your pathway to success.
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="space-y-8 mb-12">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <Card 
                key={rec.major} 
                className={`
                  ${showCards ? 'animate-fade-in animate-scale-in' : 'opacity-0'} 
                  bg-gradient-to-br ${rec.color} 
                  shadow-large hover:shadow-xl 
                  transition-all duration-500 
                  border-2 border-white/20
                  hover:scale-[1.02]
                  hover:-translate-y-1
                `}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-medium">
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-2xl md:text-3xl text-white font-bold mb-1">
                          {rec.major}
                        </CardTitle>
                        <p className="text-white/80 font-medium text-lg">
                          🏆 {rec.achievement}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                        {rec.match}%
                      </div>
                      <p className="text-white/80 text-sm font-medium">
                        {rec.matchLevel}
                      </p>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>Compatibility Score</span>
                      <span>{rec.match}%</span>
                    </div>
                    <Progress 
                      value={animateProgress ? rec.match : 0} 
                      className="h-3 bg-white/20"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-white/90 leading-relaxed text-lg">
                      {rec.description}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h4 className="text-white font-semibold mb-2 text-lg">Why This Is Perfect For You:</h4>
                    <p className="text-white/90 leading-relaxed">
                      {rec.detailedExplanation}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-white font-medium text-lg">🌟 Your Strengths That Led Here:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {rec.reasons.map((reason, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-center font-medium border border-white/30 hover:bg-white/30 transition-colors"
                        >
                          ✨ {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Celebration Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <Button
            variant="outline"
            onClick={handleRetakeQuiz}
            size="lg"
            className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-medium"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Discover More Paths
          </Button>

          <Button
            onClick={handleShare}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-accent to-orange-accent/80 hover:from-orange-accent/90 hover:to-orange-accent/70 text-orange-accent-foreground transition-all duration-300 hover:scale-105 shadow-medium"
          >
            <Share className="w-5 h-5 mr-2" />
            Share Your Results
          </Button>
          
          <Button
            onClick={handleSaveResults}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground transition-all duration-300 hover:scale-105 shadow-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Your Journey
          </Button>
        </div>

        {/* Next Steps Section */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '2s' }}>
          <Card className="bg-gradient-to-br from-primary/10 to-orange-accent/10 border-primary/20 shadow-large">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-accent bg-clip-text text-transparent">
                🚀 Your Adventure Starts Now!
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                These personalized recommendations are your compass for success. Take the next step by researching programs, connecting with advisors, and exploring internships. Your future self will thank you for starting this journey today!
              </p>
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Star className="w-5 h-5 text-orange-accent" />
                  <Star className="w-5 h-5 text-orange-accent" />
                  <Star className="w-5 h-5 text-orange-accent" />
                  <Star className="w-5 h-5 text-orange-accent" />
                  <Star className="w-5 h-5 text-orange-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;