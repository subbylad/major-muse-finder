-- Delete all data for user subomiladitan@yahoo.com to allow fresh start

-- First, get the user_id for the email
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user_id from auth.users
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = 'subomiladitan@yahoo.com';
  
  -- Only proceed if user exists
  IF target_user_id IS NOT NULL THEN
    -- Delete recommendations first (has foreign key to questionnaire_responses)
    DELETE FROM public.recommendations WHERE user_id = target_user_id;
    
    -- Delete questionnaire responses
    DELETE FROM public.questionnaire_responses WHERE user_id = target_user_id;
    
    -- Delete profile
    DELETE FROM public.profiles WHERE user_id = target_user_id;
    
    -- Finally delete the user from auth.users
    DELETE FROM auth.users WHERE id = target_user_id;
    
    RAISE NOTICE 'Successfully deleted all data for user: subomiladitan@yahoo.com';
  ELSE
    RAISE NOTICE 'User subomiladitan@yahoo.com not found in database';
  END IF;
END $$;