import { useReducer, useCallback } from 'react';

export interface QuestionnaireAnswers {
  // Question 1: Conscientiousness Assessment
  workApproach: string;
  commitmentReliability: number[];
  
  // Question 2: Holland Code Interests (ranking)
  hollandCodeRanking: string[];
  
  // Question 3: Problem-solving style
  problemSolvingApproach: string;
  groupProjectRole: string;
  
  // Question 4: Work-life integration
  workLifeScenarios: string[];
  uncertaintyComfort: number[];
  
  // Question 5: Environmental exploration
  fieldExposure: string[];
  fieldSurprise: string;
}

interface QuestionnaireState {
  currentStep: number;
  answers: QuestionnaireAnswers;
  selectedSubjects: string[];
  isLoading: boolean;
  responseId: string | null;
  isResumingProgress: boolean;
}

type QuestionnaireAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_WORK_APPROACH'; payload: string }
  | { type: 'SET_COMMITMENT_RELIABILITY'; payload: number[] }
  | { type: 'SET_HOLLAND_CODE_RANKING'; payload: string[] }
  | { type: 'SET_PROBLEM_SOLVING_APPROACH'; payload: string }
  | { type: 'SET_GROUP_PROJECT_ROLE'; payload: string }
  | { type: 'SET_WORK_LIFE_SCENARIOS'; payload: string[] }
  | { type: 'SET_UNCERTAINTY_COMFORT'; payload: number[] }
  | { type: 'SET_FIELD_EXPOSURE'; payload: string[] }
  | { type: 'SET_FIELD_SURPRISE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESPONSE_ID'; payload: string }
  | { type: 'SET_RESUMING_PROGRESS'; payload: boolean }
  | { type: 'LOAD_PROGRESS'; payload: Partial<QuestionnaireAnswers> & { step?: number } }
  | { type: 'TOGGLE_WORK_LIFE_SCENARIO'; payload: string }
  | { type: 'TOGGLE_FIELD_EXPOSURE'; payload: string };

const initialState: QuestionnaireState = {
  currentStep: 1,
  answers: {
    workApproach: '',
    commitmentReliability: [3],
    hollandCodeRanking: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'],
    problemSolvingApproach: '',
    groupProjectRole: '',
    workLifeScenarios: [],
    uncertaintyComfort: [3],
    fieldExposure: [],
    fieldSurprise: ''
  },
  selectedSubjects: [],
  isLoading: false,
  responseId: null,
  isResumingProgress: true
};

function questionnaireReducer(state: QuestionnaireState, action: QuestionnaireAction): QuestionnaireState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_WORK_APPROACH':
      return { 
        ...state, 
        answers: { ...state.answers, workApproach: action.payload }
      };
    
    case 'SET_COMMITMENT_RELIABILITY':
      return {
        ...state,
        answers: { ...state.answers, commitmentReliability: action.payload }
      };
    
    case 'SET_HOLLAND_CODE_RANKING':
      return {
        ...state,
        answers: { ...state.answers, hollandCodeRanking: action.payload }
      };
    
    case 'SET_PROBLEM_SOLVING_APPROACH':
      return {
        ...state,
        answers: { ...state.answers, problemSolvingApproach: action.payload }
      };
    
    case 'SET_GROUP_PROJECT_ROLE':
      return {
        ...state,
        answers: { ...state.answers, groupProjectRole: action.payload }
      };
    
    case 'SET_WORK_LIFE_SCENARIOS':
      return {
        ...state,
        answers: { ...state.answers, workLifeScenarios: action.payload }
      };
    
    case 'SET_UNCERTAINTY_COMFORT':
      return {
        ...state,
        answers: { ...state.answers, uncertaintyComfort: action.payload }
      };
    
    case 'SET_FIELD_EXPOSURE':
      return {
        ...state,
        answers: { ...state.answers, fieldExposure: action.payload }
      };
    
    case 'SET_FIELD_SURPRISE':
      return {
        ...state,
        answers: { ...state.answers, fieldSurprise: action.payload }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_RESPONSE_ID':
      return { ...state, responseId: action.payload };
    
    case 'SET_RESUMING_PROGRESS':
      return { ...state, isResumingProgress: action.payload };
    
    case 'LOAD_PROGRESS': {
      const { step, ...answers } = action.payload;
      return {
        ...state,
        currentStep: step || state.currentStep,
        answers: { ...state.answers, ...answers }
      };
    }
    
    case 'TOGGLE_WORK_LIFE_SCENARIO': {
      const scenarioId = action.payload;
      const currentScenarios = state.answers.workLifeScenarios;
      let newScenarios: string[];
      
      if (currentScenarios.includes(scenarioId)) {
        newScenarios = currentScenarios.filter(id => id !== scenarioId);
      } else if (currentScenarios.length < 2) {
        newScenarios = [...currentScenarios, scenarioId];
      } else {
        newScenarios = currentScenarios;
      }
      
      return {
        ...state,
        answers: { ...state.answers, workLifeScenarios: newScenarios }
      };
    }
    
    case 'TOGGLE_FIELD_EXPOSURE': {
      const exposureId = action.payload;
      const newExposure = state.answers.fieldExposure.includes(exposureId)
        ? state.answers.fieldExposure.filter(id => id !== exposureId)
        : [...state.answers.fieldExposure, exposureId];
      
      return {
        ...state,
        answers: { ...state.answers, fieldExposure: newExposure }
      };
    }
    
    default:
      return state;
  }
}

export function useQuestionnaireState() {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);

  const actions = {
    setCurrentStep: useCallback((step: number) => {
      dispatch({ type: 'SET_CURRENT_STEP', payload: step });
    }, []),

    setWorkApproach: useCallback((approach: string) => {
      dispatch({ type: 'SET_WORK_APPROACH', payload: approach });
    }, []),

    setCommitmentReliability: useCallback((value: number[]) => {
      dispatch({ type: 'SET_COMMITMENT_RELIABILITY', payload: value });
    }, []),

    setHollandCodeRanking: useCallback((ranking: string[]) => {
      dispatch({ type: 'SET_HOLLAND_CODE_RANKING', payload: ranking });
    }, []),

    setProblemSolvingApproach: useCallback((approach: string) => {
      dispatch({ type: 'SET_PROBLEM_SOLVING_APPROACH', payload: approach });
    }, []),

    setGroupProjectRole: useCallback((role: string) => {
      dispatch({ type: 'SET_GROUP_PROJECT_ROLE', payload: role });
    }, []),

    setWorkLifeScenarios: useCallback((scenarios: string[]) => {
      dispatch({ type: 'SET_WORK_LIFE_SCENARIOS', payload: scenarios });
    }, []),

    setUncertaintyComfort: useCallback((value: number[]) => {
      dispatch({ type: 'SET_UNCERTAINTY_COMFORT', payload: value });
    }, []),

    setFieldExposure: useCallback((exposure: string[]) => {
      dispatch({ type: 'SET_FIELD_EXPOSURE', payload: exposure });
    }, []),

    setFieldSurprise: useCallback((surprise: string) => {
      dispatch({ type: 'SET_FIELD_SURPRISE', payload: surprise });
    }, []),

    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),

    setResponseId: useCallback((id: string) => {
      dispatch({ type: 'SET_RESPONSE_ID', payload: id });
    }, []),

    setResumingProgress: useCallback((resuming: boolean) => {
      dispatch({ type: 'SET_RESUMING_PROGRESS', payload: resuming });
    }, []),

    loadProgress: useCallback((progress: Partial<QuestionnaireAnswers> & { step?: number }) => {
      dispatch({ type: 'LOAD_PROGRESS', payload: progress });
    }, []),

    toggleWorkLifeScenario: useCallback((scenarioId: string) => {
      dispatch({ type: 'TOGGLE_WORK_LIFE_SCENARIO', payload: scenarioId });
    }, []),

    toggleFieldExposure: useCallback((exposureId: string) => {
      dispatch({ type: 'TOGGLE_FIELD_EXPOSURE', payload: exposureId });
    }, []),
  };

  const canProceed = useCallback(() => {
    const { currentStep, answers } = state;
    if (currentStep === 1) return answers.workApproach !== '';
    if (currentStep === 2) return answers.hollandCodeRanking.length === 6; // All items ranked
    if (currentStep === 3) return answers.problemSolvingApproach !== '';
    if (currentStep === 4) return answers.workLifeScenarios.length === 2;
    if (currentStep === 5) return answers.fieldExposure.length > 0;
    return false;
  }, [state]);

  return {
    state,
    actions,
    canProceed
  };
}