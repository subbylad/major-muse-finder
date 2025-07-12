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
      
      // Save final academic strengths
      setAnswers(prev => ({ ...prev, academicStrengths: prev.academicStrengths }));
      console.log("Final answers:", answers);
      
      // Navigate to results page
      navigate("/results");
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
    <div className="min-h-screen gradient-warm py-8 px-6">
      <div className="container mx-auto max-w-3xl">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground rounded-xl px-4 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="text-lg font-medium text-muted-foreground">
            Question {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-foreground">Progress</span>
            <span className="text-muted-foreground font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 rounded-full" />
        </div>

        {/* Question Card */}
        <Card className="border-primary/10 shadow-large mb-8 rounded-3xl bg-white/90 backdrop-blur-sm">
          {currentStep === 1 && (
            <>
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-center font-semibold">
                  What subjects excite you most?
                </CardTitle>
                <p className="text-center text-muted-foreground text-lg leading-relaxed">
                  Select all that apply. Choose the subjects that genuinely interest and energize you.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4 px-8 pb-8">
                {subjectOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-start space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-soft ${
                      selectedSubjects.includes(option.id)
                        ? "border-primary bg-primary/10 shadow-soft"
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
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-lg"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
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
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-center font-semibold">
                  How do you prefer to work?
                </CardTitle>
                <p className="text-center text-muted-foreground text-lg leading-relaxed">
                  Select the working style that best describes your preference.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4 px-8 pb-8">
                <RadioGroup 
                  value={answers.workStyle} 
                  onValueChange={handleWorkStyleChange}
                  className="space-y-4"
                >
                  {workStyleOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-start space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-soft ${
                        answers.workStyle === option.id
                          ? "border-primary bg-primary/10 shadow-soft"
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
                          className="font-medium leading-none cursor-pointer text-lg"
                        >
                          {option.label}
                        </Label>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
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
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-center font-semibold">
                  Rate your confidence in these areas
                </CardTitle>
                <p className="text-center text-muted-foreground text-lg leading-relaxed">
                  Use the scale from 1 (low confidence) to 5 (high confidence) to rate yourself.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8 px-8 pb-8">
                {skillsOptions.map((skill) => (
                  <div key={skill.id} className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Label className="text-lg font-medium">{skill.label}</Label>
                        <p className="text-muted-foreground mt-1 leading-relaxed">{skill.description}</p>
                      </div>
                      <div className="text-xl font-bold text-primary min-w-12 text-center bg-primary/10 rounded-xl px-3 py-1">
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
                    <div className="flex justify-between text-sm text-muted-foreground font-medium">
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
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-center font-semibold">
                  What's most important to you in a career?
                </CardTitle>
                <p className="text-center text-muted-foreground text-lg leading-relaxed">
                  Select up to 2 values that matter most to you in your future career.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4 px-8 pb-8">
                {careerValuesOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-start space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-soft ${
                      answers.careerValues.includes(option.id)
                        ? "border-primary bg-primary/10 shadow-soft"
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
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-lg"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
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
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-center font-semibold">
                  Which academic subjects are you strongest in?
                </CardTitle>
                <p className="text-center text-muted-foreground text-lg leading-relaxed">
                  Select all subjects where you excel or have demonstrated strong performance.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4 px-8 pb-8">
                {academicStrengthsOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-start space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-soft ${
                      answers.academicStrengths.includes(option.id)
                        ? "border-primary bg-primary/10 shadow-soft"
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
                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-lg"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
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
          
          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-primary/30 text-primary hover:bg-primary/10 rounded-2xl px-8 py-6 text-lg font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gradient-primary text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-medium hover:shadow-large hover:scale-105 transition-all duration-300 border-0"
            >
              {currentStep === 5 ? "Finish Quiz" : "Next"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;