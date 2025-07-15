-- Remove the problematic unique constraint that prevents users from having multiple completed questionnaires
-- This constraint is causing the duplicate key violation error
ALTER TABLE public.questionnaire_responses 
DROP CONSTRAINT IF EXISTS questionnaire_responses_user_id_is_completed_key;