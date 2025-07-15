export interface QuestionnaireResponse {
  id: string;
  completed_at: string | null;
  created_at: string;
  is_completed: boolean;
  question_1_interests: unknown | null;
  question_2_work_style: string | null;
  question_3_skills: unknown | null;
  question_4_values: unknown | null;
  question_5_academic_strengths: unknown | null;
  updated_at: string;
  user_id: string;
}

export interface RecommendationData {
  major: string;
  confidence: number;
  reasoning: string;
  career_paths: Array<string | { role: string; work_environment: string }>;
  why_good_fit: string;
  considerations?: string;
  primary_matching_factors?: string;
  educational_pathway?: string;
  conscientiousness_fit?: string;
  problem_solving_alignment?: string;
}

export interface AIRecommendationResponse {
  recommendations: RecommendationData[];
  summary?: string;
  overall_profile?: string;
  error?: boolean;
}

export interface FormattedHistoryResponse {
  id: string;
  completed_at: string;
  recommendations: RecommendationData[];
  answers: {
    interests: unknown;
    workStyle: string;
    skillsConfidence: unknown;
    careerValues: unknown;
    academicStrengths: unknown;
  };
}

export interface ErrorWithMessage {
  message: string;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}