import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RotateCcw, Save, Trophy, Sparkles } from "lucide-react";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock recommendations based on common student profiles
  const recommendations = [
    {
      major: "Computer Science",
      match: 92,
      description: "Your strong technical skills, problem-solving abilities, and interest in technology make this an excellent fit. High earning potential and growing job market.",
      reasons: ["High technical confidence", "Problem-solving strength", "Technology interest"]
    },
    {
      major: "Business Administration", 
      match: 87,
      description: "Your leadership qualities, communication skills, and interest in career advancement align well with business studies. Versatile degree with many career paths.",
      reasons: ["Leadership confidence", "Communication skills", "Career growth focus"]
    },
    {
      major: "Data Science",
      match: 81,
      description: "Combines your mathematical abilities with technology interests. Perfect for analytical minds who want to solve real-world problems with data.",
      reasons: ["Math strengths", "Analytical thinking", "Technology focus"]
    }
  ];

  const handleRetakeQuiz = () => {
    navigate("/questionnaire");
  };

  const handleSaveResults = () => {
    toast({
      title: "Results saved!",
      description: "Your major recommendations have been saved to your profile.",
    });
    // TODO: Implement actual saving logic
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-accent/5 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-success-foreground" />
              </div>
              <Sparkles className="w-6 h-6 text-orange-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-accent bg-clip-text text-transparent">
            🎉 Quiz Complete!
          </h1>
          
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Your Recommended Majors
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, here are your top major matches. Each recommendation is tailored to your interests, skills, and career goals.
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-6 mb-8">
          {recommendations.map((rec, index) => (
            <Card key={rec.major} className={`${getMatchBackground(rec.match)} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <CardTitle className="text-xl">{rec.major}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 ${getMatchColor(rec.match)}`} />
                    <span className={`text-lg font-bold ${getMatchColor(rec.match)}`}>
                      {rec.match}% match
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {rec.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Key factors:</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.reasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-background rounded-full text-xs border border-border"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            onClick={handleRetakeQuiz}
            className="w-full sm:w-auto border-primary/20 text-primary hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
          
          <Button
            onClick={handleSaveResults}
            className="w-full sm:w-auto bg-success hover:bg-success/90 text-success-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Results
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="border-primary/10 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">What's Next?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                These recommendations are a starting point for your academic journey. Consider researching each major, talking to advisors, and exploring related courses to make the best decision for your future.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;