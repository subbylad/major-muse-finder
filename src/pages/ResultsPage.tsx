import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RotateCcw, Save, Trophy, Sparkles, Star, Award, Crown, Medal, PartyPopper, Share, AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RecommendationData, AIRecommendationResponse } from '@/types/questionnaire';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [animateProgress, setAnimateProgress] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // Get recommendations from navigation state
  const locationState = location.state as {
    recommendations?: AIRecommendationResponse;
    answers?: unknown;
    responseId?: string;
  } | null;
  
  const recommendations = locationState?.recommendations?.recommendations || null;
  const answers = locationState?.answers || null;
  const summary = locationState?.recommendations?.summary || null;
  const hasError = locationState?.recommendations?.error || false;

  useEffect(() => {
    // If no recommendations, redirect to questionnaire
    if (!recommendations && !hasError) {
      navigate('/questionnaire');
      return;
    }
    
    // Trigger animations with delay for dramatic effect
    setTimeout(() => setAnimateProgress(true), 500);
    setTimeout(() => setShowCards(true), 1000);
  }, [recommendations, hasError, navigate]);

  // Helper function to get icon for recommendations
  const getIconForMajor = (major: string) => {
    const majorLower = major.toLowerCase();
    if (majorLower.includes('computer') || majorLower.includes('software') || majorLower.includes('technology')) return Crown;
    if (majorLower.includes('business') || majorLower.includes('management') || majorLower.includes('marketing')) return Trophy;
    if (majorLower.includes('data') || majorLower.includes('statistics') || majorLower.includes('analytics')) return Medal;
    if (majorLower.includes('engineering')) return Sparkles;
    if (majorLower.includes('science') || majorLower.includes('research')) return Star;
    return Award; // Default icon
  };

  // Helper function to get achievement name
  const getAchievementForMajor = (major: string) => {
    const majorLower = major.toLowerCase();
    if (majorLower.includes('computer') || majorLower.includes('software')) return "Tech Innovator";
    if (majorLower.includes('business') || majorLower.includes('management')) return "Future Leader";
    if (majorLower.includes('data') || majorLower.includes('analytics')) return "Data Detective";
    if (majorLower.includes('engineering')) return "Problem Solver";
    if (majorLower.includes('science')) return "Research Pioneer";
    return "Career Champion";
  };

  // Helper function to get color scheme
  const getColorForConfidence = (confidence: number) => {
    if (confidence >= 90) return "from-success to-success/80";
    if (confidence >= 80) return "from-primary to-primary/80";
    return "from-orange-accent to-orange-accent/80";
  };

  // Helper function to get match level
  const getMatchLevel = (confidence: number) => {
    if (confidence >= 90) return "Perfect Match";
    if (confidence >= 85) return "Excellent Match";
    if (confidence >= 80) return "Great Match";
    return "Good Match";
  };

  const handleRetakeQuiz = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Only delete INCOMPLETE questionnaire responses to preserve history
        await supabase
          .from('questionnaire_responses')
          .delete()
          .eq('user_id', user.id)
          .eq('is_completed', false);

        // Check if user has previous results for comparison
        const { data: previousResults } = await supabase
          .from('recommendations')
          .select('recommendations')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);
        
        if (previousResults && previousResults.length > 1) {
          toast({
            title: "📈 Ready for comparison!",
            description: "Your new results will be compared to your previous attempt.",
          });
        }

        toast({
          title: "🔄 Starting fresh!",
          description: "Taking you to the beginning of the questionnaire.",
        });
      }
    } catch (error) {
      console.error('Error preparing retake:', error);
    }
    
    // Navigate with a query parameter to force a fresh start
    navigate('/questionnaire?fresh=true');
  };

  const handleSaveResults = () => {
    toast({
      title: "🎉 Results saved!",
      description: "Your major recommendations have been saved to your profile.",
    });
    // Results are already saved in the database when generated
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

  // Show error state if there was an error generating recommendations
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-orange-accent/10 p-4 sm:p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-orange-accent mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to Generate Recommendations</h2>
            <p className="text-muted-foreground mb-4">
              We encountered an issue generating your personalized recommendations. Please try again.
            </p>
            <Button onClick={() => navigate('/questionnaire')} className="w-full">
              Retake Questionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground font-normal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Header - Minimal */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-normal mb-8 text-foreground leading-tight tracking-tight">
            Your recommendations
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            {summary || "Based on your responses, we've identified majors that align with your interests, skills, and goals."}
          </p>
        </div>

        {/* Recommendation Cards - Minimal */}
        <div className="space-y-8 mb-16">
          {recommendations?.map((rec: RecommendationData, index: number) => (
            <div 
              key={rec.major} 
              className="border border-border rounded-lg p-8 transition-all duration-200 hover:border-muted-foreground"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-2">
                    {rec.major}
                  </h2>
                  <p className="text-muted-foreground text-base">
                    {rec.confidence}% match
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Rank #{index + 1}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-foreground leading-relaxed text-base">
                    {rec.reasoning}
                  </p>
                </div>

                <div>
                  <h4 className="text-foreground font-normal mb-2 text-base">Why this fits</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {rec.why_good_fit}
                  </p>
                </div>

                {rec.considerations && (
                  <div>
                    <h4 className="text-foreground font-normal mb-2 text-base">Consider</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {rec.considerations}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-foreground font-normal mb-3 text-base">Career paths</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {rec.career_paths?.map((career: string | { role: string; work_environment: string }, idx: number) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-muted rounded text-muted-foreground text-sm"
                      >
                        {typeof career === 'string' ? career : `${career.role} - ${career.work_environment}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons - Minimal */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => navigate('/history')}
            className="border border-border text-foreground hover:bg-muted px-6 py-3 text-base font-normal rounded-lg transition-all duration-200"
          >
            View History
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRetakeQuiz}
            className="border border-border text-foreground hover:bg-muted px-6 py-3 text-base font-normal rounded-lg transition-all duration-200"
          >
            Retake quiz
          </Button>

          <Button
            onClick={handleSaveResults}
            className="bg-primary text-primary-foreground px-6 py-3 text-base font-normal rounded-lg transition-all duration-200 hover:bg-primary/90"
          >
            Save results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;