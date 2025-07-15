import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
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
  const { state, actions, canProceed } = useQuestionnaireState();
  
  const totalSteps = 5;

  // Check if user is authenticated and load any existing progress
  useEffect(() => {
    // Prevent infinite loops with a flag
    let isEffectActive = true;
    
    const checkAuthAndLoadProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Check for existing incomplete response
        const { data: existingResponse, error: queryError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_completed', false)
          .maybeSingle();

        if (queryError) {
          // If there's a query error, start fresh
          actions.setResumingProgress(false);
          return;
        }

        if (existingResponse && isEffectActive) {
          // Check if the response has valid data structure
          const hasValidData = existingResponse.question_1_interests || 
                              existingResponse.question_2_work_style || 
                              existingResponse.question_3_skills || 
                              existingResponse.question_4_values || 
                              existingResponse.question_5_academic_strengths;
          
          if (hasValidData) {
            // Resume existing progress
            actions.setResponseId(existingResponse.id);
            loadProgressFromResponse(existingResponse);
            toast({
              title: "Resuming your progress",
              description: "We found your previous questionnaire progress!",
            });
          } else {
            // Delete the empty response and create a new one
            await supabase
              .from('questionnaire_responses')
              .delete()
              .eq('id', existingResponse.id);
            
            const { data: newResponse, error } = await supabase
              .from('questionnaire_responses')
              .insert({ user_id: user.id })
              .select()
              .single();

            if (!error && isEffectActive) {
              actions.setResponseId(newResponse.id);
            }
          }
        } else {
          // Create new response
          const { data: newResponse, error } = await supabase
            .from('questionnaire_responses')
            .insert({ user_id: user.id })
            .select()
            .single();

          if (error) {
            toast({
              title: "Error",
              description: "Failed to start questionnaire. Please try again.",
              variant: "destructive",
            });
            actions.setResumingProgress(false);
            return;
          }

          if (isEffectActive) {
            actions.setResponseId(newResponse.id);
          }
        }
        
        if (isEffectActive) {
          actions.setResumingProgress(false);
        }
      } catch (error) {
        if (isEffectActive) {
          actions.setResumingProgress(false);
          toast({
            title: "Error",
            description: "Failed to load questionnaire. Please refresh and try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    // Only run if we're still in resuming state
    if (state.isResumingProgress) {
      checkAuthAndLoadProgress();
    }
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isEffectActive = false;
    };
  }, [state.isResumingProgress]); // Only depend on isResumingProgress to prevent loops
  
  
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
    // Trigger selection animation
    const element = document.querySelector(`[data-subject="${subjectId}"]`);
    if (element && !state.selectedSubjects.includes(subjectId)) {
      element.classList.add('selection-bounce');
      setTimeout(() => element.classList.remove('selection-bounce'), 200);
    }
    
    actions.toggleSubject(subjectId);
  };

  // Load progress from existing response
  const loadProgressFromResponse = (response: any) => {
    let step = 1;
    const progress: any = {};
    
    if (response.question_1_interests) {
      progress.interests = response.question_1_interests;
      step = 2;
    }
    
    if (response.question_2_work_style) {
      progress.workStyle = response.question_2_work_style;
      step = 3;
    }
    
    if (response.question_3_skills) {
      progress.skillsConfidence = response.question_3_skills;
      step = 4;
    }
    
    if (response.question_4_values) {
      progress.careerValues = response.question_4_values;
      step = 5;
    }
    
    if (response.question_5_academic_strengths) {
      progress.academicStrengths = response.question_5_academic_strengths;
    }
    
    actions.loadProgress({ ...progress, step });
  };

  // Save progress to database
  const saveProgress = async (stepData: any) => {
    if (!state.responseId) return;

    try {
      const { error } = await supabase
        .from('questionnaire_responses')
        .update(stepData)
        .eq('id', state.responseId);

      if (error) {
        console.error('Error saving progress:', error);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleWorkStyleChange = (value: string) => {
    actions.setWorkStyle(value);
  };

  const handleSkillConfidenceChange = (skillId: string, value: number[]) => {
    actions.setSkillConfidence(skillId, value);
  };


  const handleNext = async () => {
    if (state.currentStep === 1) {
      if (state.selectedSubjects.length === 0) return;
      
      // Save to database
      await saveProgress({ question_1_interests: state.selectedSubjects });
      
      setTimeout(() => actions.setCurrentStep(2), 100);
    } else if (state.currentStep === 2) {
      if (!state.answers.workStyle) return;
      
      // Save work style to database
      await saveProgress({ question_2_work_style: state.answers.workStyle });
      
      setTimeout(() => actions.setCurrentStep(3), 100);
    } else if (state.currentStep === 3) {
      // Save skills to database
      await saveProgress({ question_3_skills: state.answers.skillsConfidence });
      
      setTimeout(() => actions.setCurrentStep(4), 100);
    } else if (state.currentStep === 4) {
      if (state.answers.careerValues.length === 0) return;
      
      // Save career values to database
      await saveProgress({ question_4_values: state.answers.careerValues });
      
      setTimeout(() => actions.setCurrentStep(5), 100);
    } else if (state.currentStep === 5) {
      if (state.answers.academicStrengths.length === 0) return;
      
      // Questionnaire complete, save final answer and generate recommendations
      actions.setLoading(true);
      
      // Prepare final answers outside try block so it's accessible in catch
      const finalAnswers = {
        ...state.answers,
        interests: state.selectedSubjects,
        academicStrengths: state.answers.academicStrengths
      };
      
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Save final answer and mark as completed
        
        const { error: updateError } = await supabase
          .from('questionnaire_responses')
          .update({
            question_5_academic_strengths: state.answers.academicStrengths,
            is_completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', state.responseId);

        if (updateError) {
          throw new Error(updateError.message);
        }

        // Generate AI recommendations
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('AI service timeout after 60 seconds')), 60000);
        });
        
        const aiPromise = supabase.functions.invoke('generate-recommendations', {
          body: { answers: finalAnswers }
        });
        
        const response = await Promise.race([aiPromise, timeoutPromise]);

        if (response.error) {
          throw new Error(`AI Service Error: ${response.error.message || 'Unknown error'}`);
        }
        
        if (!response.data) {
          throw new Error('AI service returned empty response');
        }

        // Save recommendations to database
        const { error: recommendationError } = await supabase
          .from('recommendations')
          .insert({
            user_id: user.id,
            questionnaire_response_id: state.responseId,
            recommendations: response.data
          });

        if (recommendationError) {
          // Don't fail the whole flow if saving recommendations fails
          console.error('Error saving recommendations:', recommendationError);
        }

        // Navigate to results with the recommendations
        navigate('/results', { 
          state: { 
            recommendations: response.data,
            answers: finalAnswers,
            responseId: state.responseId
          } 
        });
      } catch (error) {
        // Check if it's a specific AI service error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('timeout')) {
          toast({
            title: "Request Timeout",
            description: "AI service is taking too long. Using backup recommendations.",
            variant: "default",
          });
        } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          toast({
            title: "Service Unavailable", 
            description: "AI service not deployed. Using backup recommendations.",
            variant: "default",
          });
        } else {
          toast({
            title: "AI Service Error",
            description: `${errorMessage}. Using backup recommendations.`,
            variant: "default",
          });
        }
        
        // Fallback recommendations when AI service fails
        const fallbackRecommendations = {
          recommendations: [
            {
              major: "Computer Science",
              confidence: 85,
              reasoning: "Based on your responses, you show strong analytical thinking and interest in technology. Computer Science offers diverse career opportunities in software development, AI, and tech innovation.",
              career_paths: ["Software Developer", "Data Scientist", "Product Manager", "Tech Entrepreneur"],
              why_good_fit: "Your technical aptitude and problem-solving skills align well with this field",
              considerations: "Requires continuous learning as technology evolves rapidly"
            },
            {
              major: "Business Administration",
              confidence: 78,
              reasoning: "Your leadership qualities and strategic thinking make you well-suited for business roles. This major provides versatility across industries.",
              career_paths: ["Management Consultant", "Marketing Manager", "Operations Director", "Business Analyst"],
              why_good_fit: "Your communication skills and goal-oriented approach match business environments",
              considerations: "Consider specializing in an area that matches your specific interests"
            },
            {
              major: "Psychology",
              confidence: 72,
              reasoning: "Your interest in understanding people and helping others indicates a strong fit for psychology and human-centered fields.",
              career_paths: ["Clinical Psychologist", "HR Specialist", "UX Researcher", "Counselor"],
              why_good_fit: "Your empathy and analytical skills are valuable in understanding human behavior",
              considerations: "May require additional graduate education for certain career paths"
            }
          ],
          summary: "We encountered an issue with our AI service, so we've provided general recommendations based on common career paths. For personalized results, please try again or consult with an academic advisor."
        };

        // Navigate to results with fallback data
        navigate('/results', { 
          state: { 
            recommendations: fallbackRecommendations,
            answers: finalAnswers,
            responseId: state.responseId
          } 
        });
        
        toast({
          title: "Using Backup Recommendations",
          description: "We provided general recommendations. Try again later for personalized results.",
          variant: "default",
        });
      }
    }
  };

  const handleBack = () => {
    if (state.currentStep === 5) {
      actions.setCurrentStep(4);
    } else if (state.currentStep === 4) {
      actions.setCurrentStep(3);
    } else if (state.currentStep === 3) {
      actions.setCurrentStep(2);
    } else if (state.currentStep === 2) {
      actions.setCurrentStep(1);
    } else if (state.currentStep === 1) {
      navigate("/auth");
    }
  };

  const progressPercentage = (state.currentStep / totalSteps) * 100;

  // Show loading state while checking for existing progress
  if (state.isResumingProgress) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl py-8 px-8">
        {/* Header - Minimal */}
        <div className="flex items-center justify-between mb-16">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground font-normal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-sm font-normal text-muted-foreground">
            {state.currentStep} of {totalSteps}
          </div>
        </div>

        {/* Progress - Minimal */}
        <div className="mb-20">
          <div className="w-full bg-border h-px mb-8">
            <div 
              className="h-px bg-foreground transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Section - Minimal */}
        <div className="mb-16">
          {state.currentStep === 1 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  What subjects excite you most?
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
                  Select all that apply. Choose the subjects that genuinely interest and energize you.
                </p>
              </div>
              
              <div className="space-y-3 max-w-2xl mx-auto">
                {subjectOptions.map((option) => (
                  <div
                    key={option.id}
                    data-subject={option.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      state.selectedSubjects.includes(option.id)
                        ? "border-foreground bg-muted/30"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    onClick={() => handleSubjectToggle(option.id)}
                  >
                    <Checkbox
                      id={option.id}
                      checked={state.selectedSubjects.includes(option.id)}
                      onCheckedChange={() => handleSubjectToggle(option.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="font-normal leading-none cursor-pointer text-lg block mb-1"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {state.currentStep === 2 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  How do you prefer to work?
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
                  Select the working style that best describes your preference.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <RadioGroup 
                  value={state.answers.workStyle} 
                  onValueChange={handleWorkStyleChange}
                  className="space-y-3"
                >
                  {workStyleOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        state.answers.workStyle === option.id
                          ? "border-foreground bg-muted/30"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => handleWorkStyleChange(option.id)}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.id}
                          className="font-normal leading-none cursor-pointer text-lg block mb-1"
                        >
                          {option.label}
                        </Label>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          {state.currentStep === 3 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  Rate your confidence in these areas
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
                  Use the scale from 1 (low confidence) to 5 (high confidence) to rate yourself.
                </p>
              </div>
              
              <div className="space-y-8 max-w-3xl mx-auto">
                {skillsOptions.map((skill) => (
                  <div key={skill.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-lg font-normal text-foreground">{skill.label}</Label>
                        <p className="text-muted-foreground mt-1 leading-relaxed text-sm">{skill.description}</p>
                      </div>
                      <div className="text-lg font-normal text-foreground min-w-8 text-center">
                        {state.answers.skillsConfidence[skill.id as keyof typeof state.answers.skillsConfidence][0]}
                      </div>
                    </div>
                    <Slider
                      value={state.answers.skillsConfidence[skill.id as keyof typeof state.answers.skillsConfidence]}
                      onValueChange={(value) => handleSkillConfidenceChange(skill.id, value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Average</span>
                      <span>High</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {state.currentStep === 4 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  What's most important to you in a career?
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
                  Select up to 2 values that matter most to you in your future career.
                </p>
              </div>
              
              <div className="space-y-3 max-w-2xl mx-auto">
                {careerValuesOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      state.answers.careerValues.includes(option.id)
                        ? "border-foreground bg-muted/30"
                        : "border-border hover:border-muted-foreground"
                    } ${
                      !state.answers.careerValues.includes(option.id) && state.answers.careerValues.length >= 2
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (state.answers.careerValues.includes(option.id) || state.answers.careerValues.length < 2) {
                        actions.toggleCareerValue(option.id);
                      }
                    }}
                  >
                    <Checkbox
                      id={option.id}
                      checked={state.answers.careerValues.includes(option.id)}
                      onCheckedChange={() => {
                        if (state.answers.careerValues.includes(option.id) || state.answers.careerValues.length < 2) {
                          actions.toggleCareerValue(option.id);
                        }
                      }}
                      className="w-5 h-5"
                      disabled={!state.answers.careerValues.includes(option.id) && state.answers.careerValues.length >= 2}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="font-normal leading-none cursor-pointer text-lg block mb-1"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {state.currentStep === 5 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  Which academic subjects are you strongest in?
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
                  Select all subjects where you excel or have demonstrated strong performance.
                </p>
              </div>
              
              <div className="space-y-3 max-w-2xl mx-auto">
                {academicStrengthsOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      state.answers.academicStrengths.includes(option.id)
                        ? "border-foreground bg-muted/30"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    onClick={() => actions.toggleAcademicStrength(option.id)}
                  >
                    <Checkbox
                      id={option.id}
                      checked={state.answers.academicStrengths.includes(option.id)}
                      onCheckedChange={() => actions.toggleAcademicStrength(option.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="font-normal leading-none cursor-pointer text-lg block mb-1"
                      >
                        {option.label}
                      </label>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-4 mt-20">
          {state.currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border border-border text-foreground hover:bg-muted px-6 py-3 text-base font-normal rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || state.isLoading}
            className="bg-primary text-primary-foreground px-8 py-3 text-base font-normal rounded-lg transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating results...
              </>
            ) : state.currentStep === 5 ? (
              "Complete"
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;