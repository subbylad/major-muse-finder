import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const QuestionnairePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-accent/5 p-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Questionnaire Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              The personalized questionnaire is being prepared. This will be a multi-step form to discover your ideal major.
            </p>
            <Button onClick={() => navigate("/")}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionnairePage;