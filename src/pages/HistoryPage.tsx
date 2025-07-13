import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Trophy, RotateCcw, Eye, Loader2 } from "lucide-react";

interface QuestionnaireResponse {
  id: string;
  completed_at: string;
  answers: any;
  recommendations: any[];
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      await loadHistory(user.id);
    };
    
    checkAuthAndLoadHistory();
  }, [navigate]);

  const loadHistory = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select(`
          id,
          completed_at,
          question_1_interests,
          question_2_work_style,
          question_3_skills,
          question_4_values,
          question_5_academic_strengths,
          is_completed,
          recommendations (
            recommendations
          )
        `)
        .eq('user_id', userId)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(response => ({
        ...response,
        recommendations: Array.isArray(response.recommendations?.[0]?.recommendations) 
          ? response.recommendations[0].recommendations 
          : [],
        // Reconstruct answers object from individual columns for compatibility
        answers: {
          interests: response.question_1_interests || [],
          workStyle: response.question_2_work_style || "",
          skillsConfidence: response.question_3_skills || {},
          careerValues: response.question_4_values || [],
          academicStrengths: response.question_5_academic_strengths || []
        }
      }));

      setResponses(formattedData);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error",
        description: "Failed to load your history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewResults = (response: QuestionnaireResponse) => {
    navigate('/results', {
      state: {
        recommendations: { recommendations: response.recommendations },
        answers: response.answers,
        responseId: response.id
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-warm">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
            >
              Account
            </Button>
            <Button
              onClick={() => navigate("/questionnaire")}
              className="gradient-primary text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Take New Quiz
            </Button>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-primary">Your Career Journey</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review your past questionnaire results and see how your interests have evolved over time.
          </p>
        </div>

        {/* History Content */}
        {responses.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">No History Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't taken any questionnaires yet. Start your career discovery journey today!
              </p>
              <Button
                onClick={() => navigate("/questionnaire")}
                className="gradient-primary text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Take Your First Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                You've completed {responses.length} questionnaire{responses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {responses.map((response, index) => (
              <Card key={response.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Questionnaire #{responses.length - index}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Completed on {formatDate(response.completed_at)}
                      </p>
                    </div>
                    <Button
                      onClick={() => viewResults(response)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Results
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {response.recommendations && response.recommendations.length > 0 ? (
                    <div>
                      <h4 className="font-semibold mb-3">Top Recommendations:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {response.recommendations.slice(0, 4).map((rec: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-primary/5 rounded-lg"
                          >
                            <span className="font-medium">{rec.major}</span>
                            <span className="text-sm text-primary font-semibold">
                              {rec.confidence}%
                            </span>
                          </div>
                        ))}
                      </div>
                      {response.recommendations.length > 4 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          +{response.recommendations.length - 4} more recommendations
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recommendations available</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;