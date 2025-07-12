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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-orange-accent/10 p-4 sm:p-6 relative overflow-hidden">
      {/* Floating celebration elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-5 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-success/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-32 sm:top-40 right-10 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 sm:bottom-40 left-10 sm:left-20 w-4 h-4 sm:w-5 sm:h-5 bg-orange-accent/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-16 sm:bottom-20 right-5 sm:right-10 w-2 h-2 sm:w-3 sm:h-3 bg-purple-accent/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl relative">
        {/* Celebration Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative animate-scale-in">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center shadow-large">
                <PartyPopper className="w-10 h-10 sm:w-14 sm:h-14 text-success-foreground" />
              </div>
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-accent to-orange-accent/70 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-accent-foreground animate-pulse" />
              </div>
              <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 sm:w-3 sm:h-3 text-primary-foreground animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-orange-accent to-success bg-clip-text text-transparent animate-fade-in px-2" style={{ animationDelay: '0.2s' }}>
            🎊 Your Career Journey Unlocked!
          </h1>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-3 sm:mb-4 animate-fade-in px-2" style={{ animationDelay: '0.4s' }}>
            Top Major Recommendations
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
            🌟 Congratulations! We've analyzed your unique strengths, interests, and goals to discover your perfect academic matches. These aren't just suggestions—they're your pathway to success.
          </p>
        </div>

        {/* Achievement Cards - Mobile Optimized */}
        <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
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
                  hover:scale-[1.01] sm:hover:scale-[1.02]
                  hover:-translate-y-1
                `}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-medium">
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 sm:flex-none">
                        <CardTitle className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-1">
                          {rec.major}
                        </CardTitle>
                        <p className="text-white/80 font-medium text-sm sm:text-lg">
                          🏆 {rec.achievement}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                        {rec.match}%
                      </div>
                      <p className="text-white/80 text-xs sm:text-sm font-medium">
                        {rec.matchLevel}
                      </p>
                    </div>
                  </div>

                  {/* Visual Progress Bar - Mobile Optimized */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                      <span>Compatibility Score</span>
                      <span>{rec.match}%</span>
                    </div>
                    <Progress 
                      value={animateProgress ? rec.match : 0} 
                      className="h-2 sm:h-3 bg-white/20"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                    <p className="text-white/90 leading-relaxed text-sm sm:text-base md:text-lg">
                      {rec.description}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                    <h4 className="text-white font-semibold mb-2 text-base sm:text-lg">Why This Is Perfect For You:</h4>
                    <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                      {rec.detailedExplanation}
                    </p>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-white font-medium text-sm sm:text-base md:text-lg">🌟 Your Strengths That Led Here:</p>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {rec.reasons.map((reason, idx) => (
                        <div
                          key={idx}
                          className="px-3 sm:px-4 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-center font-medium border border-white/30 hover:bg-white/30 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center touch-manipulation"
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

        {/* Celebration Action Buttons - Mobile Optimized */}
        <div className="flex flex-col gap-4 sm:gap-6 justify-center items-stretch sm:items-center animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleRetakeQuiz}
              className="w-full sm:w-auto min-h-[48px] sm:min-h-[56px] px-6 sm:px-8 text-base font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-medium touch-manipulation"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Discover More Paths
            </Button>

            <Button
              onClick={handleShare}
              className="w-full sm:w-auto min-h-[48px] sm:min-h-[56px] px-6 sm:px-8 text-base font-medium bg-gradient-to-r from-orange-accent to-orange-accent/80 hover:from-orange-accent/90 hover:to-orange-accent/70 text-orange-accent-foreground transition-all duration-300 hover:scale-105 shadow-medium touch-manipulation"
            >
              <Share className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Share Your Results
            </Button>
          </div>
          
          <Button
            onClick={handleSaveResults}
            className="w-full sm:w-auto min-h-[48px] sm:min-h-[56px] px-6 sm:px-8 text-base font-medium bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground transition-all duration-300 hover:scale-105 shadow-medium touch-manipulation"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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