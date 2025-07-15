import { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { HollandCodeRanking } from "@/components/questionnaire/HollandCodeRanking";
import { ScaleQuestion } from "@/components/questionnaire/ScaleQuestion";
import { toErrorWithMessage } from '@/types/questionnaire';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { state, actions, canProceed } = useQuestionnaireState();
  
  const totalSteps = 5;
  const isFreshStart = searchParams.get('fresh') === 'true';

  // Load progress from existing response
  const loadProgressFromResponse = useCallback((response: Record<string, unknown>) => {
    let step = 1;
    const progress: Record<string, unknown> = {};
    
    if (response.question_1_interests) {
      progress.workApproach = response.question_1_interests;
      step = 2;
    }
    
    if (response.question_2_work_style) {
      progress.hollandCodeRanking = response.question_2_work_style;
      step = 3;
    }
    
    if (response.question_3_skills) {
      progress.problemSolvingApproach = response.question_3_skills;
      step = 4;
    }
    
    if (response.question_4_values) {
      progress.workLifeScenarios = response.question_4_values;
      step = 5;
    }
    
    if (response.question_5_academic_strengths) {
      progress.fieldExposure = response.question_5_academic_strengths;
    }
    
    actions.loadProgress({ ...progress, step });
  }, [actions]);

  // Check if user is authenticated and load any existing progress
  const checkAuthAndLoadProgress = useCallback(async () => {
    const isEffectActive = true;
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // If this is a fresh start (retake), reset state and create new response
        if (isFreshStart) {
          // Reset the entire questionnaire state
          actions.resetState();
          
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
            actions.setResumingProgress(false);
          }
          return;
        }

        // Check for existing incomplete response only if not a fresh start
        const { data: existingResponse, error: queryError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_completed', false)
          .maybeSingle();

        if (queryError) {
          actions.setResumingProgress(false);
          return;
        }

        if (existingResponse && isEffectActive) {
          const hasValidData = existingResponse.question_1_interests || 
                              existingResponse.question_2_work_style || 
                              existingResponse.question_3_skills || 
                              existingResponse.question_4_values || 
                              existingResponse.question_5_academic_strengths;
          
          if (hasValidData) {
            actions.setResponseId(existingResponse.id);
            loadProgressFromResponse(existingResponse);
            toast({
              title: "Resuming your progress",
              description: "We found your previous questionnaire progress!",
            });
          } else {
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
  }, [isFreshStart, actions, toast, navigate, loadProgressFromResponse]);
  
  useEffect(() => {
    if (state.isResumingProgress) {
      checkAuthAndLoadProgress();
    }
  }, [state.isResumingProgress, checkAuthAndLoadProgress]);

  // Warn user before leaving page if they have progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.currentStep > 1 && !state.isLoading) {
        e.preventDefault();
        e.returnValue = 'You have unsaved progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.currentStep, state.isLoading]);

  // Question 1: Work Approach Options
  const workApproachOptions = [
    { 
      id: "steady-planner", 
      label: "Steady Planner", 
      description: "I create a detailed timeline and work consistently each day" 
    },
    { 
      id: "strategic-organizer", 
      label: "Strategic Organizer", 
      description: "I break it into phases, plan extensively, then execute systematically" 
    },
    { 
      id: "motivated-sprinter", 
      label: "Motivated Sprinter", 
      description: "I wait until I feel inspired, then work intensively" 
    },
    { 
      id: "deadline-driver", 
      label: "Deadline Driver", 
      description: "I work best under pressure in focused bursts near deadlines" 
    },
    { 
      id: "collaborative-coordinator", 
      label: "Collaborative Coordinator", 
      description: "I prefer working with others for accountability" 
    }
  ];

  // Question 3: Problem-solving options
  const problemSolvingOptions = [
    { 
      id: "systematic-investigator", 
      label: "Systematic Investigator", 
      description: "Research extensively before making changes" 
    },
    { 
      id: "iterative-experimenter", 
      label: "Iterative Experimenter", 
      description: "Try small improvements and learn from results" 
    },
    { 
      id: "collaborative-problem-solver", 
      label: "Collaborative Problem-Solver", 
      description: "Gather stakeholder input and build consensus" 
    },
    { 
      id: "strategic-redesigner", 
      label: "Strategic Redesigner", 
      description: "Question assumptions and envision major restructuring" 
    }
  ];

  const groupProjectRoleOptions = [
    { id: "technical-specialist", label: "Technical Specialist", description: "Focus on specific technical aspects" },
    { id: "process-coordinator", label: "Process Coordinator", description: "Ensure deadlines and connections" },
    { id: "strategic-planner", label: "Strategic Planner", description: "Design overall approach" },
    { id: "relationship-manager", label: "Relationship Manager", description: "Facilitate communication" }
  ];

  // Question 4: Work-Life scenarios
  const workLifeScenarioOptions = [
    { 
      id: "predictable-structure", 
      label: "Predictable Structure", 
      description: "Consistent hours, clear boundaries, job security" 
    },
    { 
      id: "high-achievement", 
      label: "High Achievement", 
      description: "Variable hours, high earning potential, rapid advancement" 
    },
    { 
      id: "geographic-flexibility", 
      label: "Geographic Flexibility", 
      description: "Willing to relocate, travel-heavy roles" 
    },
    { 
      id: "community-rooted", 
      label: "Community Rooted", 
      description: "Stay local, work-life integration, moderate travel" 
    },
    { 
      id: "entrepreneurial-freedom", 
      label: "Entrepreneurial Freedom", 
      description: "Flexible schedule, high risk/reward" 
    },
    { 
      id: "mission-driven-impact", 
      label: "Mission-Driven Impact", 
      description: "Values-aligned work, societal contribution" 
    }
  ];

  // Question 5: Field exposure options
  const fieldExposureOptions = [
    { 
      id: "direct-observation", 
      label: "Direct Observation", 
      description: "Shadowed professionals or visited workplaces" 
    },
    { 
      id: "hands-on-experience", 
      label: "Hands-On Experience", 
      description: "Internships, volunteer work, or projects" 
    },
    { 
      id: "informational-interviews", 
      label: "Informational Interviews", 
      description: "Spoke with professionals about their work" 
    },
    { 
      id: "academic-exploration", 
      label: "Academic Exploration", 
      description: "Relevant courses or workshops" 
    },
    { 
      id: "online-research", 
      label: "Online Research", 
      description: "Researched career realities online" 
    },
    { 
      id: "limited-exposure", 
      label: "Limited Exposure", 
      description: "Interest based mainly on general ideas" 
    }
  ];

  const fieldSurpriseOptions = [
    { id: "work-reality", label: "Work Reality", description: "Daily tasks were different than expected" },
    { id: "education-requirements", label: "Education Requirements", description: "Preparation needed was different" },
    { id: "people-skills", label: "People Skills", description: "More interpersonal interaction than thought" },
    { id: "problem-types", label: "Problem Types", description: "Kinds of problems were unexpected" },
    { id: "career-paths", label: "Career Paths", description: "More diverse opportunities than realized" },
    { id: "work-environment", label: "Work Environment", description: "Workplace culture/setting was different" },
    { id: "still-learning", label: "Still Learning", description: "Haven't had enough exposure yet" }
  ];

  // Save progress to database
  const saveProgress = async (stepData: Record<string, unknown>) => {
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

  const handleNext = async () => {
    if (state.currentStep === 1) {
      if (!state.answers.workApproach) return;
      
      await saveProgress({ question_1_interests: state.answers.workApproach });
      setTimeout(() => actions.setCurrentStep(2), 100);
    } else if (state.currentStep === 2) {
      await saveProgress({ question_2_work_style: state.answers.hollandCodeRanking });
      setTimeout(() => actions.setCurrentStep(3), 100);
    } else if (state.currentStep === 3) {
      if (!state.answers.problemSolvingApproach) return;
      
      await saveProgress({ question_3_skills: state.answers.problemSolvingApproach });
      setTimeout(() => actions.setCurrentStep(4), 100);
    } else if (state.currentStep === 4) {
      if (state.answers.workLifeScenarios.length !== 2) return;
      
      await saveProgress({ question_4_values: state.answers.workLifeScenarios });
      setTimeout(() => actions.setCurrentStep(5), 100);
    } else if (state.currentStep === 5) {
      if (state.answers.fieldExposure.length === 0) return;
      
      actions.setLoading(true);
      
      const finalAnswers = {
        ...state.answers
      };
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { error: updateError } = await supabase
          .from('questionnaire_responses')
          .update({
            question_5_academic_strengths: state.answers.fieldExposure,
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
        
        const response = await Promise.race([aiPromise, timeoutPromise]) as { data?: unknown; error?: { message?: string } };

        if (response?.error) {
          throw new Error(`AI Service Error: ${response.error.message || 'Unknown error'}`);
        }
        
        if (!response?.data) {
          throw new Error('AI service returned empty response');
        }

        // Only save recommendations if we have a valid response ID
        if (state.responseId) {
          const { error: recommendationError } = await supabase
            .from('recommendations')
            .insert({
              user_id: user.id,
              questionnaire_response_id: state.responseId,
              recommendations: response.data
            });

          if (recommendationError) {
            console.error('Error saving recommendations:', recommendationError);
          }
        } else {
          console.warn('No response ID available, skipping recommendation save');
        }

        // Show success message
        toast({
          title: "🎉 Questionnaire Complete!",
          description: "Your personalized recommendations are ready. You can view them anytime in your history.",
        });
        
        navigate('/results', { 
          state: { 
            recommendations: response.data,
            answers: finalAnswers,
            responseId: state.responseId
          } 
        });
      } catch (error) {
        const errorMessage = toErrorWithMessage(error);
        
        console.error('AI recommendation generation failed:', error);
        
        toast({
          title: "AI Service Error",
          description: `${errorMessage.message}. Using backup recommendations.`,
          variant: "default",
        });
        
        // Fallback recommendations
        const fallbackRecommendations = {
          recommendations: [
            {
              major: "Business Administration",
              confidence: 85,
              reasoning: "Based on your responses, you show strong organizational and leadership capabilities. Business Administration offers diverse career opportunities across all industries.",
              career_paths: ["Management Consultant", "Marketing Manager", "Operations Director", "Business Analyst"],
              why_good_fit: "Your strategic thinking and communication skills align well with business environments",
              considerations: "Consider specializing in an area that matches your specific interests"
            }
          ],
          summary: "We encountered an issue with our AI service, so we've provided general recommendations. For personalized results, please try again later."
        };

        // Show success message even for fallback
        toast({
          title: "🎉 Questionnaire Complete!",
          description: "We've provided general recommendations. You can retake the quiz anytime for personalized results.",
        });
        
        navigate('/results', { 
          state: { 
            recommendations: fallbackRecommendations,
            answers: finalAnswers,
            responseId: state.responseId
          } 
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
      navigate("/");
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
        {/* Header */}
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
            Question {state.currentStep} of {totalSteps}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-20">
          <div className="w-full bg-border h-px mb-8">
            <div 
              className="h-px bg-foreground transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-16">
          {state.currentStep === 1 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  Work Style & Self-Regulation
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal mb-8">
                  When facing a challenging long-term project, which approach best describes you?
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto mb-8">
                <RadioGroup 
                  value={state.answers.workApproach} 
                  onValueChange={actions.setWorkApproach}
                  className="space-y-3"
                >
                  {workApproachOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        state.answers.workApproach === option.id
                          ? "border-foreground bg-muted/30"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => actions.setWorkApproach(option.id)}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.id}
                          className="font-medium leading-none cursor-pointer text-lg block mb-1"
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

              {state.answers.workApproach && (
                <div className="max-w-2xl mx-auto">
                  <ScaleQuestion
                    title="Rate your consistency in following through on commitments:"
                    value={state.answers.commitmentReliability}
                    onChange={actions.setCommitmentReliability}
                    leftLabel="Often miss commitments"
                    rightLabel="Extremely reliable"
                  />
                </div>
              )}
            </>
          )}

          {state.currentStep === 2 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  Interest Areas Ranking
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
                  Rank these activity categories from MOST to LEAST interesting:
                </p>
              </div>
              
              <HollandCodeRanking
                items={state.answers.hollandCodeRanking}
                onReorder={actions.setHollandCodeRanking}
              />
            </>
          )}

          {state.currentStep === 3 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  Problem-Solving Approach
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal mb-8">
                  You're improving a system that isn't working well. Your approach:
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto mb-8">
                <RadioGroup 
                  value={state.answers.problemSolvingApproach} 
                  onValueChange={actions.setProblemSolvingApproach}
                  className="space-y-3"
                >
                  {problemSolvingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        state.answers.problemSolvingApproach === option.id
                          ? "border-foreground bg-muted/30"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => actions.setProblemSolvingApproach(option.id)}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.id}
                          className="font-medium leading-none cursor-pointer text-lg block mb-1"
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

              {state.answers.problemSolvingApproach && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-normal mb-6 text-center">In group projects, you typically:</h3>
                  <RadioGroup 
                    value={state.answers.groupProjectRole} 
                    onValueChange={actions.setGroupProjectRole}
                    className="space-y-3"
                  >
                    {groupProjectRoleOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          state.answers.groupProjectRole === option.id
                            ? "border-foreground bg-muted/30"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => actions.setGroupProjectRole(option.id)}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={option.id}
                            className="font-medium leading-none cursor-pointer text-lg block mb-1"
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
              )}
            </>
          )}

          {state.currentStep === 4 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  Work-Life Preferences
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal mb-8">
                  Select the TWO work-life scenarios that appeal to you most:
                </p>
              </div>
              
              <div className="space-y-3 max-w-2xl mx-auto mb-8">
                {workLifeScenarioOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      state.answers.workLifeScenarios.includes(option.id)
                        ? "border-foreground bg-muted/30"
                        : "border-border hover:border-muted-foreground"
                    } ${
                      !state.answers.workLifeScenarios.includes(option.id) && state.answers.workLifeScenarios.length >= 2
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (state.answers.workLifeScenarios.includes(option.id) || state.answers.workLifeScenarios.length < 2) {
                        actions.toggleWorkLifeScenario(option.id);
                      }
                    }}
                  >
                    <Checkbox
                      id={option.id}
                      checked={state.answers.workLifeScenarios.includes(option.id)}
                      onCheckedChange={() => {
                        if (state.answers.workLifeScenarios.includes(option.id) || state.answers.workLifeScenarios.length < 2) {
                          actions.toggleWorkLifeScenario(option.id);
                        }
                      }}
                      className="w-5 h-5"
                      disabled={!state.answers.workLifeScenarios.includes(option.id) && state.answers.workLifeScenarios.length >= 2}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="font-medium leading-none cursor-pointer text-lg block mb-1"
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

              {state.answers.workLifeScenarios.length === 2 && (
                <div className="max-w-2xl mx-auto">
                  <ScaleQuestion
                    title="Comfort with work uncertainty:"
                    value={state.answers.uncertaintyComfort}
                    onChange={actions.setUncertaintyComfort}
                    leftLabel="Prefer clear procedures"
                    rightLabel="Thrive in uncertain environments"
                  />
                </div>
              )}
            </>
          )}

          {state.currentStep === 5 && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground leading-tight tracking-tight">
                  Field Exposure & Experience
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal mb-8">
                  Describe your exposure to your field(s) of interest (select all that apply):
                </p>
              </div>
              
              <div className="space-y-3 max-w-2xl mx-auto mb-8">
                {fieldExposureOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      state.answers.fieldExposure.includes(option.id)
                        ? "border-foreground bg-muted/30"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    onClick={() => actions.toggleFieldExposure(option.id)}
                  >
                    <Checkbox
                      id={option.id}
                      checked={state.answers.fieldExposure.includes(option.id)}
                      onCheckedChange={() => actions.toggleFieldExposure(option.id)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="font-medium leading-none cursor-pointer text-lg block mb-1"
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

              {state.answers.fieldExposure.length > 0 && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-normal mb-6 text-center">What surprised you most about your field of interest:</h3>
                  <RadioGroup 
                    value={state.answers.fieldSurprise} 
                    onValueChange={actions.setFieldSurprise}
                    className="space-y-3"
                  >
                    {fieldSurpriseOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          state.answers.fieldSurprise === option.id
                            ? "border-foreground bg-muted/30"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => actions.setFieldSurprise(option.id)}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={option.id}
                            className="font-medium leading-none cursor-pointer text-lg block mb-1"
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
              )}
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