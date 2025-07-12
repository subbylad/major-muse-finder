import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Calculator, FlaskConical, Palette, PenTool, Briefcase, Monitor, User, Users, Building, Blend, Brain, Lightbulb, Crown, Wrench, MessageCircle, DollarSign, Shield, Sparkles, Heart, Scale, Trophy, Loader2 } from "lucide-react";

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isLoading, setIsLoading] = useState(false);
  
  // All answers storage
  const [answers, setAnswers] = useState({
    interests: [] as string[],
    workStyle: "" as string,
    skillsConfidence: {
      problemSolving: [3],
      creativeThinking: [3],
      leadership: [3],
      technicalSkills: [3],
      communication: [3]
    },
    careerValues: [] as string[],
    academicStrengths: [] as string[]
  });
  
  // Question 1: Subject interests
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  const subjectOptions = [
    { id: "math", label: "Math", description: "Numbers, equations, problem-solving", icon: Calculator },
    { id: "science", label: "Science", description: "Biology, chemistry, physics, research", icon: FlaskConical },
    { id: "arts", label: "Arts", description: "Visual arts, design, creativity", icon: Palette },
    { id: "writing", label: "Writing", description: "Literature, journalism, communication", icon: PenTool },
    { id: "business", label: "Business", description: "Economics, management, entrepreneurship", icon: Briefcase },
    { id: "technology", label: "Technology", description: "Programming, engineering, innovation", icon: Monitor }
  ];
  
  // Question 2: Work preference
  const workStyleOptions = [
    { id: "independently", label: "Independently", description: "I work best on my own, with minimal supervision", icon: User },
    { id: "small-teams", label: "In small teams", description: "I prefer collaborating with 2-4 people", icon: Users },
    { id: "large-groups", label: "Large group projects", description: "I thrive in bigger collaborative environments", icon: Building },
    { id: "mix", label: "Mix of both", description: "I enjoy variety in how I work", icon: Blend }
  ];

  // Question 3: Skills confidence
  const skillsOptions = [
    { id: "problemSolving", label: "Problem Solving", description: "Analyzing issues and finding solutions", icon: Brain },
    { id: "creativeThinking", label: "Creative Thinking", description: "Generating innovative ideas and approaches", icon: Lightbulb },
    { id: "leadership", label: "Leadership", description: "Guiding and motivating others", icon: Crown },
    { id: "technicalSkills", label: "Technical Skills", description: "Working with tools, software, or systems", icon: Wrench },
    { id: "communication", label: "Communication", description: "Expressing ideas clearly and effectively", icon: MessageCircle }
  ];

  // Question 4: Career values
  const careerValuesOptions = [
    { id: "high-salary", label: "High salary", description: "Earning a competitive income and financial security", icon: DollarSign },
    { id: "job-security", label: "Job security", description: "Stable employment and predictable career path", icon: Shield },
    { id: "creative-freedom", label: "Creative freedom", description: "Autonomy to innovate and express creativity", icon: Sparkles },
    { id: "helping-others", label: "Helping others", description: "Making a positive impact on people's lives", icon: Heart },
    { id: "work-life-balance", label: "Work-life balance", description: "Manageable hours and personal time", icon: Scale },
    { id: "leadership-opportunities", label: "Leadership opportunities", description: "Managing teams and driving organizational change", icon: Trophy }
  ];

  // Question 5: Academic strengths
  const academicStrengthsOptions = [
    { id: "mathematics", label: "Mathematics", description: "Algebra, calculus, statistics, problem-solving", icon: Calculator },
    { id: "sciences", label: "Sciences", description: "Biology, chemistry, physics, research methods", icon: FlaskConical },
    { id: "english-literature", label: "English/Literature", description: "Writing, reading comprehension, analysis", icon: PenTool },
    { id: "history", label: "History", description: "Research, critical thinking, understanding context", icon: Crown },
    { id: "foreign-languages", label: "Foreign Languages", description: "Communication, cultural understanding", icon: MessageCircle },
    { id: "computer-science", label: "Computer Science", description: "Programming, logic, technology", icon: Monitor },
    { id: "art", label: "Art", description: "Creativity, visual design, artistic expression", icon: Palette },
    { id: "business", label: "Business", description: "Economics, management, entrepreneurship", icon: Briefcase }
  ];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => {
      const newSelection = prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId];
      
      // Trigger selection animation
      const element = document.querySelector(`[data-subject="${subjectId}"]`);
      if (element && !prev.includes(subjectId)) {
        element.classList.add('selection-bounce');
        setTimeout(() => element.classList.remove('selection-bounce'), 200);
      }
      
      return newSelection;
    });
  };

  const handleWorkStyleChange = (value: string) => {
    setAnswers(prev => ({ ...prev, workStyle: value }));
  };

  const handleSkillConfidenceChange = (skillId: string, value: number[]) => {
    setAnswers(prev => ({
      ...prev,
      skillsConfidence: {
        ...prev.skillsConfidence,
        [skillId]: value
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

  const handleNext = async () => {
    if (currentStep === 1) {
      if (selectedSubjects.length === 0) return;
      
      // Save subjects and move to next question with animation
      setAnswers(prev => ({ ...prev, interests: selectedSubjects }));
      setTimeout(() => setCurrentStep(2), 100);
    } else if (currentStep === 2) {
      if (!answers.workStyle) return;
      
      setTimeout(() => setCurrentStep(3), 100);
    } else if (currentStep === 3) {
      setTimeout(() => setCurrentStep(4), 100);
    } else if (currentStep === 4) {
      if (answers.careerValues.length === 0) return;
      
      setTimeout(() => setCurrentStep(5), 100);
    } else if (currentStep === 5) {
      if (answers.academicStrengths.length === 0) return;
      
      // Questionnaire complete, save and generate recommendations
      setIsLoading(true);
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const finalAnswers = {
          ...answers,
          interests: selectedSubjects,
          academicStrengths: answers.academicStrengths
        };

        // Save questionnaire response to database
        const { data: questionnaireResponse, error: saveError } = await supabase
          .from('questionnaire_responses')
          .insert({
            user_id: user.id,
            answers: finalAnswers
          })
          .select()
          .single();

        if (saveError) {
          throw new Error(saveError.message);
        }

        // Generate AI recommendations
        const response = await supabase.functions.invoke('generate-recommendations', {
          body: { answers: finalAnswers }
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        // Save recommendations to database
        const { error: recommendationError } = await supabase
          .from('recommendations')
          .insert({
            user_id: user.id,
            questionnaire_response_id: questionnaireResponse.id,
            recommendations: response.data
          });

        if (recommendationError) {
          console.error('Error saving recommendations:', recommendationError);
          // Don't fail the whole flow if saving recommendations fails
        }

        // Navigate to results with the recommendations
        navigate('/results', { 
          state: { 
            recommendations: response.data,
            answers: finalAnswers,
            responseId: questionnaireResponse.id
          } 
        });
      } catch (error) {
        console.error('Error generating recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to generate recommendations. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 gradient-warm"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-5 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-32 sm:top-40 right-10 sm:right-20 w-36 h-36 sm:w-48 sm:h-48 bg-orange-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 sm:bottom-40 left-1/4 w-30 h-30 sm:w-40 sm:h-40 bg-purple-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 sm:bottom-20 right-1/3 w-28 h-28 sm:w-36 sm:h-36 bg-success/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 py-6 sm:py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        {/* Header with back button - Mobile Optimized */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground rounded-xl px-3 sm:px-4 py-3 min-h-[44px] touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          <div className="text-sm sm:text-lg font-medium text-muted-foreground">
            Question {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Progress Bar - Mobile Optimized */}
        <div className="mb-12 sm:mb-16">
          {/* Progress Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Your Progress</h3>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Step {currentStep} of {totalSteps} • {Math.round(progressPercentage)}% Complete
            </p>
          </div>
          
          {/* Visual Progress Steps - Mobile Optimized */}
          <div className="relative max-w-2xl mx-auto">
            {/* Progress Line Background */}
            <div className="absolute top-6 sm:top-8 left-0 right-0 h-0.5 sm:h-1 bg-border rounded-full mx-6 sm:mx-8"></div>
            
            {/* Animated Progress Line */}
            <div 
              className="absolute top-6 sm:top-8 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary to-purple-accent rounded-full mx-6 sm:mx-8 transition-all duration-700 ease-out animate-progress-fill"
              style={{ 
                width: `calc(${progressPercentage}% - 48px)`,
                '--progress-width': `${progressPercentage}%`
              } as React.CSSProperties}
            ></div>
            
            {/* Step Circles - Mobile Optimized */}
            <div className="flex justify-between relative z-10">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                const isUpcoming = stepNumber > currentStep;
                
                return (
                  <div
                    key={stepNumber}
                    className={`relative flex flex-col items-center transition-all duration-500 ${
                      isCurrent ? 'scale-110' : ''
                    }`}
                  >
                    {/* Step Circle - Mobile Optimized */}
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg border-2 sm:border-4 transition-all duration-500 ${
                        isCompleted
                          ? 'bg-success text-success-foreground border-success shadow-lg'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground border-primary shadow-large animate-pulse'
                          : 'bg-background text-muted-foreground border-border'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    
                    {/* Step Label - Mobile Optimized */}
                    <div className={`mt-2 sm:mt-3 text-center transition-all duration-300 ${
                      isCurrent ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}>
                      <div className="text-xs sm:text-sm font-medium">
                        {stepNumber === 1 && 'Interests'}
                        {stepNumber === 2 && 'Work Style'}
                        {stepNumber === 3 && 'Skills'}
                        {stepNumber === 4 && 'Values'}
                        {stepNumber === 5 && 'Strengths'}
                      </div>
                    </div>
                    
                    {/* Completion Sparkle Effect - Mobile Optimized */}
                    {isCompleted && (
                      <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 animate-bounce">
                        <div className="w-full h-full bg-orange-accent rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 sm:w-3 sm:h-3 text-orange-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Encouraging Message - Mobile Optimized */}
          <div className="text-center mt-6 sm:mt-8">
            {currentStep === 1 && (
              <p className="text-sm sm:text-base text-muted-foreground">🚀 Let's discover your interests!</p>
            )}
            {currentStep === 2 && (
              <p className="text-sm sm:text-base text-muted-foreground">💪 Great start! Now about your work style...</p>
            )}
            {currentStep === 3 && (
              <p className="text-sm sm:text-base text-muted-foreground">⭐ Awesome! Let's explore your skills...</p>
            )}
            {currentStep === 4 && (
              <p className="text-sm sm:text-base text-muted-foreground">🎯 Amazing progress! What drives you?</p>
            )}
            {currentStep === 5 && (
              <p className="text-sm sm:text-base text-muted-foreground">🏆 Almost there! Your academic strengths...</p>
            )}
          </div>
        </div>

        {/* Question Card - Mobile Optimized */}
        <Card className="border-primary/10 shadow-large mb-6 sm:mb-8 rounded-3xl bg-white/90 backdrop-blur-sm">
          {currentStep === 1 && (
            <>
              <CardHeader className="pb-8 sm:pb-12 px-4 sm:px-6">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-center font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-purple-accent bg-clip-text text-transparent">
                  What subjects excite you most?
                </CardTitle>
                <p className="text-center text-muted-foreground text-base sm:text-xl leading-relaxed max-w-2xl mx-auto px-2">
                  Select all that apply. Choose the subjects that genuinely interest and energize you.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-8 pb-6 sm:pb-8">
                {subjectOptions.map((option) => (
                  <div
                    key={option.id}
                    data-subject={option.id}
                    className={`group flex items-start space-x-3 sm:space-x-5 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-primary/60 hover:bg-primary/5 hover:shadow-large min-h-[80px] touch-manipulation ${
                      selectedSubjects.includes(option.id)
                        ? "border-primary bg-primary/10 shadow-medium scale-[1.01] animate-scale-in"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() => handleSubjectToggle(option.id)}
                  >
                    {/* Icon - Mobile Optimized */}
                    <div className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                      selectedSubjects.includes(option.id)
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}>
                      <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <Checkbox
                      id={option.id}
                      checked={selectedSubjects.includes(option.id)}
                      onCheckedChange={() => handleSubjectToggle(option.id)}
                      className="mt-1 min-w-[20px] min-h-[20px]"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-lg sm:text-xl mb-1 sm:mb-2 block"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-lg">
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
              <CardHeader className="pb-12">
                <CardTitle className="text-3xl md:text-4xl text-center font-bold mb-6 bg-gradient-to-r from-primary to-purple-accent bg-clip-text text-transparent">
                  How do you prefer to work?
                </CardTitle>
                <p className="text-center text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
                  Select the working style that best describes your preference.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 pb-8">
                <RadioGroup 
                  value={answers.workStyle} 
                  onValueChange={handleWorkStyleChange}
                  className="space-y-4"
                >
                  {workStyleOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`group flex items-start space-x-5 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:border-primary/60 hover:bg-primary/5 hover:shadow-large ${
                        answers.workStyle === option.id
                          ? "border-primary bg-primary/10 shadow-medium scale-[1.01]"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => handleWorkStyleChange(option.id)}
                    >
                      {/* Icon */}
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        answers.workStyle === option.id
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                      }`}>
                        <option.icon className="w-6 h-6" />
                      </div>
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
              <CardHeader className="pb-12">
                <CardTitle className="text-3xl md:text-4xl text-center font-bold mb-6 bg-gradient-to-r from-primary to-purple-accent bg-clip-text text-transparent">
                  Rate your confidence in these areas
                </CardTitle>
                <p className="text-center text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
                  Use the scale from 1 (low confidence) to 5 (high confidence) to rate yourself.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8 px-8 pb-8">
                {skillsOptions.map((skill) => (
                  <div key={skill.id} className="space-y-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <skill.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <Label className="text-xl font-bold">{skill.label}</Label>
                          <p className="text-muted-foreground mt-1 leading-relaxed text-lg">{skill.description}</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary min-w-16 text-center bg-primary/10 rounded-2xl px-4 py-2 shadow-soft">
                        {answers.skillsConfidence[skill.id as keyof typeof answers.skillsConfidence][0]}
                      </div>
                    </div>
                    <Slider
                      value={answers.skillsConfidence[skill.id as keyof typeof answers.skillsConfidence]}
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
              <CardHeader className="pb-12">
                <CardTitle className="text-3xl md:text-4xl text-center font-bold mb-6 bg-gradient-to-r from-primary to-purple-accent bg-clip-text text-transparent">
                  What's most important to you in a career?
                </CardTitle>
                <p className="text-center text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
                  Select up to 2 values that matter most to you in your future career.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 pb-8">
                {careerValuesOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`group flex items-start space-x-5 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:border-primary/60 hover:bg-primary/5 hover:shadow-large ${
                      answers.careerValues.includes(option.id)
                        ? "border-primary bg-primary/10 shadow-medium scale-[1.01]"
                        : "border-border hover:border-primary/30"
                    } ${
                      !answers.careerValues.includes(option.id) && answers.careerValues.length >= 2
                        ? "opacity-50 cursor-not-allowed hover:scale-100"
                        : ""
                    }`}
                    onClick={() => {
                      if (answers.careerValues.includes(option.id) || answers.careerValues.length < 2) {
                        handleCareerValueToggle(option.id);
                      }
                    }}
                  >
                    {/* Icon */}
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      answers.careerValues.includes(option.id)
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}>
                      <option.icon className="w-6 h-6" />
                    </div>
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
                        className="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-xl mb-2 block"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground leading-relaxed text-lg">
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
              <CardHeader className="pb-12">
                <CardTitle className="text-3xl md:text-4xl text-center font-bold mb-6 bg-gradient-to-r from-primary to-purple-accent bg-clip-text text-transparent">
                  Which academic subjects are you strongest in?
                </CardTitle>
                <p className="text-center text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
                  Select all subjects where you excel or have demonstrated strong performance.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 pb-8">
                {academicStrengthsOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`group flex items-start space-x-5 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:border-primary/60 hover:bg-primary/5 hover:shadow-large ${
                      answers.academicStrengths.includes(option.id)
                        ? "border-primary bg-primary/10 shadow-medium scale-[1.01]"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() => handleAcademicStrengthToggle(option.id)}
                  >
                    {/* Icon */}
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      answers.academicStrengths.includes(option.id)
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}>
                      <option.icon className="w-6 h-6" />
                    </div>
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
          
          <div className="flex gap-6 justify-center">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-2 border-primary/30 text-primary hover:bg-primary/10 rounded-2xl px-10 py-6 text-xl font-bold hover:scale-105 transition-all duration-300 hover:shadow-medium"
              >
                <ArrowLeft className="w-6 h-6 mr-3" />
                Back
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="gradient-primary text-white rounded-2xl px-12 py-6 text-xl font-bold shadow-large hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Generating Your Results...
                </>
              ) : currentStep === 5 ? (
                <>
                  <Trophy className="w-6 h-6 mr-3" />
                  Finish Quiz
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;