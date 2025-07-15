import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoading } from "@/components/common/PageLoading";
import { getUserHistory } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, RotateCcw, Eye } from "lucide-react";
import type { FormattedHistoryResponse, RecommendationData } from '@/types/questionnaire';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuthCheck();
  const [responses, setResponses] = useState<FormattedHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      loadHistory(user.id);
    }
  }, [user, authLoading, loadHistory]);

  const loadHistory = useCallback(async (userId: string) => {
    if (!userId) {
      console.error('No user ID provided to loadHistory');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await getUserHistory(userId, 20); // Load last 20 responses

      if (error) throw error;

      setResponses(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to load your history: ${errorMessage}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const viewResults = (response: FormattedHistoryResponse) => {
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

  if (authLoading || isLoading) {
    return <PageLoading message="Loading your history..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-8 py-8 max-w-4xl">
        <PageHeader
          title="Your History"
          subtitle="Review your past questionnaire results and see how your interests have evolved over time."
          onBack={() => navigate("/")}
          rightContent={
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="text-muted-foreground hover:text-foreground font-normal"
              >
                Account
              </Button>
              <Button
                onClick={() => navigate("/questionnaire")}
                className="bg-primary text-primary-foreground px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200 hover:bg-primary/90"
              >
                Take New Quiz
              </Button>
            </div>
          }
        />

        {/* History Content */}
        {responses.length === 0 ? (
          <div className="text-center border border-border rounded-lg p-12">
            <h2 className="text-2xl font-normal mb-4 text-foreground">No History Yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven't taken any questionnaires yet. Start your career discovery journey today!
            </p>
            <Button
              onClick={() => navigate("/questionnaire")}
              className="bg-primary text-primary-foreground px-6 py-3 text-base font-normal rounded-lg transition-all duration-200 hover:bg-primary/90"
            >
              Take Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                You've completed {responses.length} questionnaire{responses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {responses.map((response, index) => (
              <div key={response.id} className="border border-border rounded-lg p-6 transition-all duration-200 hover:border-muted-foreground">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-normal text-foreground mb-2">
                      Questionnaire #{responses.length - index}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Completed on {formatDate(response.completed_at)}
                    </p>
                  </div>
                  <Button
                    onClick={() => viewResults(response)}
                    variant="outline"
                    className="border border-border text-foreground hover:bg-muted px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200"
                  >
                    View Results
                  </Button>
                </div>
                
                <div>
                  {response.recommendations && response.recommendations.length > 0 ? (
                    <div>
                      <h4 className="font-normal mb-3 text-foreground">Top Recommendations:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {response.recommendations.slice(0, 4).map((rec: RecommendationData, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-muted rounded"
                          >
                            <span className="font-normal text-foreground">{rec.major}</span>
                            <span className="text-sm text-muted-foreground">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;