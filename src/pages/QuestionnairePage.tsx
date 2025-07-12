import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QuestionnairePage = () => {
  const navigate = useNavigate();
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Question 1: Subject interests
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  const subjectOptions = [
    { id: "math", label: "Math", description: "Numbers, equations, problem-solving" },
    { id: "science", label: "Science", description: "Biology, chemistry, physics, research" },
    { id: "arts", label: "Arts", description: "Visual arts, design, creativity" },
    { id: "writing", label: "Writing", description: "Literature, journalism, communication" },
    { id: "business", label: "Business", description: "Economics, management, entrepreneurship" },
    { id: "technology", label: "Technology", description: "Programming, engineering, innovation" }
  ];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleNext = () => {
    if (selectedSubjects.length === 0) {
      return; // Don't proceed without selections
    }
    
    console.log("Question 1 answers:", selectedSubjects);
    // TODO: Navigate to next question or show completion
    alert("Moving to next question...");
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-accent/5 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Question {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-primary/10 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              What subjects excite you most?
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Select all that apply. Choose the subjects that genuinely interest and energize you.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {subjectOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-primary/30 hover:bg-primary/5 ${
                  selectedSubjects.includes(option.id)
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
                onClick={() => handleSubjectToggle(option.id)}
              >
                <Checkbox
                  id={option.id}
                  checked={selectedSubjects.includes(option.id)}
                  onCheckedChange={() => handleSubjectToggle(option.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedSubjects.length > 0 && (
              <span>{selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""} selected</span>
            )}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={selectedSubjects.length === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;