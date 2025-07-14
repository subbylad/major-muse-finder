import { supabase } from '@/integrations/supabase/client';

// Optimized query to get user's complete data in a single request
export async function getUserCompleteData(userId: string) {
  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select(`
      id,
      completed_at,
      question_1_interests,
      question_2_work_style,
      question_3_skills,
      question_4_values,
      question_5_academic_strengths,
      is_completed,
      recommendations!inner (
        id,
        recommendations,
        created_at
      )
    `)
    .eq('user_id', userId)
    .eq('is_completed', true)
    .order('completed_at', { ascending: false });

  return { data, error };
}

// Optimized query to get user's history with pagination
export async function getUserHistory(userId: string, limit: number = 10, offset: number = 0) {
  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select(`
      id,
      completed_at,
      question_1_interests,
      question_2_work_style,
      question_3_skills,
      question_4_values,
      question_5_academic_strengths,
      recommendations!inner (
        recommendations
      )
    `)
    .eq('user_id', userId)
    .eq('is_completed', true)
    .order('completed_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { data: null, error };

  const formattedData = data?.map(response => ({
    ...response,
    recommendations: Array.isArray(response.recommendations?.[0]?.recommendations) 
      ? response.recommendations[0].recommendations 
      : [],
    answers: {
      interests: response.question_1_interests || [],
      workStyle: response.question_2_work_style || "",
      skillsConfidence: response.question_3_skills || {},
      careerValues: response.question_4_values || [],
      academicStrengths: response.question_5_academic_strengths || []
    }
  }));

  return { data: formattedData, error: null };
}

// Optimized query for data export with single query
export async function getUserDataForExport(userId: string) {
  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select(`
      *,
      recommendations (*)
    `)
    .eq('user_id', userId);

  return { data, error };
}

// Batch update questionnaire progress
export async function batchUpdateQuestionnaireProgress(responseId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('questionnaire_responses')
    .update(updates)
    .eq('id', responseId)
    .select()
    .single();

  return { data, error };
}

// Check if user has existing incomplete questionnaire (cached)
let incompleteQuestionnaireCache: { [userId: string]: string | null } = {};

export async function getIncompleteQuestionnaire(userId: string, useCache: boolean = true) {
  if (useCache && incompleteQuestionnaireCache[userId] !== undefined) {
    return { data: incompleteQuestionnaireCache[userId], error: null };
  }

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select('id, question_1_interests, question_2_work_style, question_3_skills, question_4_values, question_5_academic_strengths')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .maybeSingle();

  if (!error) {
    incompleteQuestionnaireCache[userId] = data?.id || null;
  }

  return { data, error };
}

// Clear cache when questionnaire is completed
export function clearQuestionnaireCache(userId: string) {
  delete incompleteQuestionnaireCache[userId];
}