import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QuestionnairePage = () => {
  const navigate = useNavigate();
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // All answers storage
  const [answers, setAnswers] = useState({
    subjects: [] as string[],
    workStyle: "" as string,
    skillsConfidence: {
      problemSolving: 3,
      creativeThinking: 3,
      leadership: 3,
      technicalSkills: 3,
      communication: 3
    },
    careerValues: [] as string[],
    academicStrengths: [] as string[]
  });
  
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
  
  // Question 2: Work preference
  const workStyleOptions = [
    { id: "independently", label: "Independently", description: "I work best on my own, with minimal supervision" },
    { id: "small-teams", label: "In small teams", description: "I prefer collaborating with 2-4 people" },
    { id: "large-groups", label: "Large group projects", description: "I thrive in bigger collaborative environments" },
    { id: "mix", label: "Mix of both", description: "I enjoy variety in how I work" }
  ];

  // Question 3: Skills confidence
  const skillsOptions = [
    { id: "problemSolving", label: "Problem Solving", description: "Analyzing issues and finding solutions" },
    { id: "creativeThinking", label: "Creative Thinking", description: "Generating innovative ideas and approaches" },
    { id: "leadership", label: "Leadership", description: "Guiding and motivating others" },
    { id: "technicalSkills", label: "Technical Skills", description: "Working with tools, software, or systems" },
    { id: "communication", label: "Communication", description: "Expressing ideas clearly and effectively" }
  ];

  // Question 4: Career values
  const careerValuesOptions = [
    { id: "high-salary", label: "High salary", description: "Earning a competitive income and financial security" },
    { id: "job-security", label: "Job security", description: "Stable employment and predictable career path" },
    { id: "creative-freedom", label: "Creative freedom", description: "Autonomy to innovate and express creativity" },
    { id: "helping-others", label: "Helping others", description: "Making a positive impact on people's lives" },
    { id: "work-life-balance", label: "Work-life balance", description: "Manageable hours and personal time" },
    { id: "leadership-opportunities", label: "Leadership opportunities", description: "Managing teams and driving organizational change" }
  ];

  // Question 5: Academic strengths
  const academicStrengthsOptions = [
    { id: "mathematics", label: "Mathematics", description: "Algebra, calculus, statistics, problem-solving" },
    { id: "sciences", label: "Sciences", description: "Biology, chemistry, physics, research methods" },
    { id: "english-literature", label: "English/Literature", description: "Writing, reading comprehension, analysis" },
    { id: "history", label: "History", description: "Research, critical thinking, understanding context" },
    { id: "foreign-languages", label: "Foreign Languages", description: "Communication, cultural understanding" },
    { id: "computer-science", label: "Computer Science", description: "Programming, logic, technology" },
    { id: "art", label: "Art", description: "Creativity, visual design, artistic expression" },
    { id: "business", label: "Business", description: "Economics, management, entrepreneurship" }
  ];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleWorkStyleChange = (value: string) => {
    setAnswers(prev => ({ ...prev, workStyle: value }));
  };

  const handleSkillConfidenceChange = (skillId: string, value: number[]) => {
    setAnswers(prev => ({
      ...prev,
      skillsConfidence: {
        ...prev.skillsConfidence,
        [skillId]: value[0]
      }
    }));
  };

  const handleCareerValueToggle = (valueId: string) => {
    setAnswers(prev => {
      const currentValues = prev.careerValues;
      
      if (currentValues.includes(valueId)) {
        // Remove if already selected
        return {
          ...prev,
          careerValues: currentValues.filter(id => id !== valueId)
        };
      } else if (currentValues.length < 2) {
        // Add if less than 2 selected
        return {
          ...prev,
          careerValues: [...currentValues, valueId]
        };
      }
      
      // Don't add if already at maximum
      return prev;
    });
  };

  const handleAcademicStrengthToggle = (strengthId: string) => {
    setAnswers(prev => ({
      ...prev,
      academicStrengths: prev.academicStrengths.includes(strengthId)
        ? prev.academicStrengths.filter(id => id !== strengthId)
        : [...prev.academicStrengths, strengthId]
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedSubjects.length === 0) return;
      
      // Save subjects and move to next question
      setAnswers(prev => ({ ...prev, subjects: selectedSubjects }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!answers.workStyle) return;
      
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (answers.careerValues.length === 0) return;
      
      setCurrentStep(5);
    } else if (currentStep === 5) {
      if (answers.academicStrengths.length === 0) return;
      
      console.log("Final answers:", answers);
      // TODO: Navigate to results page
      alert("Quiz completed! Generating your major recommendations...");
    }
  };

  const handleBack = () => {
    if (currentStep === 5) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      navigate("/auth");
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedSubjects.length > 0;
    if (currentStep === 2) return answers.workStyle !== "";
    if (currentStep === 3) return true; // Skills have default values, always can proceed
    if (currentStep === 4) return answers.careerValues.length > 0;
    if (currentStep === 5) return answers.academicStrengths.length > 0;
    return false;
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-accent/5 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
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
          {currentStep === 1 && (
            <>
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
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  How do you prefer to work?
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Select the working style that best describes your preference.
                </p>
              </CardHeader>
              
              <CardContent>
                <RadioGroup 
                  value={answers.workStyle} 
                  onValueChange={handleWorkStyleChange}
                  className="space-y-4"
                >
                  {workStyleOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-primary/30 hover:bg-primary/5 ${
                        answers.workStyle === option.id
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                      onClick={() => handleWorkStyleChange(option.id)}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.id}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {option.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  Rate your confidence in these areas
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Use the scale from 1 (low confidence) to 5 (high confidence) to rate yourself.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {skillsOptions.map((skill) => (
                  <div key={skill.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-sm font-medium">{skill.label}</Label>
                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                      </div>
                      <div className="text-sm font-semibold text-primary min-w-8 text-center">
                        {answers.skillsConfidence[skill.id as keyof typeof answers.skillsConfidence]}
                      </div>
                    </div>
                    <Slider
                      value={[answers.skillsConfidence[skill.id as keyof typeof answers.skillsConfidence]]}
                      onValueChange={(value) => handleSkillConfidenceChange(skill.id, value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 - Low</span>
                      <span>3 - Average</span>
                      <span>5 - High</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  What's most important to you in a career?
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Select up to 2 values that matter most to you in your future career.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {careerValuesOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-primary/30 hover:bg-primary/5 ${
                      answers.careerValues.includes(option.id)
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    } ${
                      !answers.careerValues.includes(option.id) && answers.careerValues.length >= 2
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (answers.careerValues.includes(option.id) || answers.careerValues.length < 2) {
                        handleCareerValueToggle(option.id);
                      }
                    }}
                  >
                    <Checkbox
                      id={option.id}
                      checked={answers.careerValues.includes(option.id)}
                      onCheckedChange={() => {
                        if (answers.careerValues.includes(option.id) || answers.careerValues.length < 2) {
                          handleCareerValueToggle(option.id);
                        }
                      }}
                      className="mt-1"
                      disabled={!answers.careerValues.includes(option.id) && answers.careerValues.length >= 2}
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
            </>
          )}

          {currentStep === 5 && (
            <>
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  Which academic subjects are you strongest in?
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Select all subjects where you excel or have demonstrated strong performance.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {academicStrengthsOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-primary/30 hover:bg-primary/5 ${
                      answers.academicStrengths.includes(option.id)
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                    onClick={() => handleAcademicStrengthToggle(option.id)}
                  >
                    <Checkbox
                      id={option.id}
                      checked={answers.academicStrengths.includes(option.id)}
                      onCheckedChange={() => handleAcademicStrengthToggle(option.id)}
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
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {currentStep === 1 && selectedSubjects.length > 0 && (
              <span>{selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""} selected</span>
            )}
            {currentStep === 2 && answers.workStyle && (
              <span>Work style selected</span>
            )}
            {currentStep === 3 && (
              <span>Confidence levels set</span>
            )}
            {currentStep === 4 && (
              <span>Selected: {answers.careerValues.length}/2</span>
            )}
            {currentStep === 5 && answers.academicStrengths.length > 0 && (
              <span>{answers.academicStrengths.length} strength{answers.academicStrengths.length !== 1 ? "s" : ""} selected</span>
            )}
          </div>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-primary/20 text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {currentStep === 5 ? "Finish Quiz" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;