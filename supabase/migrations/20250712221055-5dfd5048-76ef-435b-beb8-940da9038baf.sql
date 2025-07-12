-- Drop existing questionnaire_responses table to recreate with proper structure
DROP TABLE IF EXISTS public.recommendations;
DROP TABLE IF EXISTS public.questionnaire_responses;

-- Create enhanced questionnaire_responses table with granular columns
CREATE TABLE public.questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_1_interests JSONB,
  question_2_work_style TEXT,
  question_3_skills JSONB,
  question_4_values JSONB,
  question_5_academic_strengths JSONB,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, is_completed) -- Only one incomplete response per user
);

-- Recreate recommendations table with updated foreign key
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questionnaire_response_id UUID NOT NULL REFERENCES public.questionnaire_responses(id) ON DELETE CASCADE,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for questionnaire_responses
CREATE POLICY "Users can view their own responses" 
ON public.questionnaire_responses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own responses" 
ON public.questionnaire_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" 
ON public.questionnaire_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
ON public.recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON public.questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();