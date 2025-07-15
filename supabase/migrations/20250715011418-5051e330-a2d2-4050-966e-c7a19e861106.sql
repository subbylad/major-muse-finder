-- Remove the problematic unique constraint that prevents users from having multiple completed questionnaires
-- This constraint is causing the duplicate key violation error
DROP CONSTRAINT IF EXISTS questionnaire_responses_user_id_is_completed_key ON public.questionnaire_responses;

-- If users should be allowed multiple completed questionnaires, we don't need this constraint
-- If users should only have one, we'll handle it in application logic instead