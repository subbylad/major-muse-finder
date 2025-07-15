import { useReducer, useCallback } from 'react';

export interface QuestionnaireAnswers {
  interests: string[];
  workStyle: string;
  skillsConfidence: {
    problemSolving: number[];
    creativeThinking: number[];
    leadership: number[];
    technicalSkills: number[];
    communication: number[];
  };
  careerValues: string[];
  academicStrengths: string[];
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
  | { type: 'SET_SELECTED_SUBJECTS'; payload: string[] }
  | { type: 'SET_WORK_STYLE'; payload: string }
  | { type: 'SET_SKILL_CONFIDENCE'; payload: { skillId: string; value: number[] } }
  | { type: 'SET_CAREER_VALUES'; payload: string[] }
  | { type: 'SET_ACADEMIC_STRENGTHS'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESPONSE_ID'; payload: string }
  | { type: 'SET_RESUMING_PROGRESS'; payload: boolean }
  | { type: 'LOAD_PROGRESS'; payload: Partial<QuestionnaireAnswers> & { step?: number } }
  | { type: 'TOGGLE_SUBJECT'; payload: string }
  | { type: 'TOGGLE_CAREER_VALUE'; payload: string }
  | { type: 'TOGGLE_ACADEMIC_STRENGTH'; payload: string };

const initialState: QuestionnaireState = {
  currentStep: 1,
  answers: {
    interests: [],
    workStyle: '',
    skillsConfidence: {
      problemSolving: [3],
      creativeThinking: [3],
      leadership: [3],
      technicalSkills: [3],
      communication: [3]
    },
    careerValues: [],
    academicStrengths: []
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
    
    case 'SET_SELECTED_SUBJECTS':
      return { 
        ...state, 
        selectedSubjects: action.payload,
        answers: { ...state.answers, interests: action.payload }
      };
    
    case 'SET_WORK_STYLE':
      return { 
        ...state, 
        answers: { ...state.answers, workStyle: action.payload }
      };
    
    case 'SET_SKILL_CONFIDENCE':
      return {
        ...state,
        answers: {
          ...state.answers,
          skillsConfidence: {
            ...state.answers.skillsConfidence,
            [action.payload.skillId]: action.payload.value
          }
        }
      };
    
    case 'SET_CAREER_VALUES':
      return {
        ...state,
        answers: { ...state.answers, careerValues: action.payload }
      };
    
    case 'SET_ACADEMIC_STRENGTHS':
      return {
        ...state,
        answers: { ...state.answers, academicStrengths: action.payload }
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
        answers: { ...state.answers, ...answers },
        selectedSubjects: answers.interests || state.selectedSubjects
      };
    }
    
    case 'TOGGLE_SUBJECT': {
      const subjectId = action.payload;
      const newSelectedSubjects = state.selectedSubjects.includes(subjectId)
        ? state.selectedSubjects.filter(id => id !== subjectId)
        : [...state.selectedSubjects, subjectId];
      
      return {
        ...state,
        selectedSubjects: newSelectedSubjects,
        answers: { ...state.answers, interests: newSelectedSubjects }
      };
    }
    
    case 'TOGGLE_CAREER_VALUE': {
      const valueId = action.payload;
      const currentValues = state.answers.careerValues;
      let newCareerValues: string[];
      
      if (currentValues.includes(valueId)) {
        newCareerValues = currentValues.filter(id => id !== valueId);
      } else if (currentValues.length < 2) {
        newCareerValues = [...currentValues, valueId];
      } else {
        newCareerValues = currentValues;
      }
      
      return {
        ...state,
        answers: { ...state.answers, careerValues: newCareerValues }
      };
    }
    
    case 'TOGGLE_ACADEMIC_STRENGTH': {
      const strengthId = action.payload;
      const newStrengths = state.answers.academicStrengths.includes(strengthId)
        ? state.answers.academicStrengths.filter(id => id !== strengthId)
        : [...state.answers.academicStrengths, strengthId];
      
      return {
        ...state,
        answers: { ...state.answers, academicStrengths: newStrengths }
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

    setSelectedSubjects: useCallback((subjects: string[]) => {
      dispatch({ type: 'SET_SELECTED_SUBJECTS', payload: subjects });
    }, []),

    setWorkStyle: useCallback((workStyle: string) => {
      dispatch({ type: 'SET_WORK_STYLE', payload: workStyle });
    }, []),

    setSkillConfidence: useCallback((skillId: string, value: number[]) => {
      dispatch({ type: 'SET_SKILL_CONFIDENCE', payload: { skillId, value } });
    }, []),

    setCareerValues: useCallback((values: string[]) => {
      dispatch({ type: 'SET_CAREER_VALUES', payload: values });
    }, []),

    setAcademicStrengths: useCallback((strengths: string[]) => {
      dispatch({ type: 'SET_ACADEMIC_STRENGTHS', payload: strengths });
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

    toggleSubject: useCallback((subjectId: string) => {
      dispatch({ type: 'TOGGLE_SUBJECT', payload: subjectId });
    }, []),

    toggleCareerValue: useCallback((valueId: string) => {
      dispatch({ type: 'TOGGLE_CAREER_VALUE', payload: valueId });
    }, []),

    toggleAcademicStrength: useCallback((strengthId: string) => {
      dispatch({ type: 'TOGGLE_ACADEMIC_STRENGTH', payload: strengthId });
    }, []),
  };

  const canProceed = useCallback(() => {
    const { currentStep, selectedSubjects, answers } = state;
    if (currentStep === 1) return selectedSubjects.length > 0;
    if (currentStep === 2) return answers.workStyle !== '';
    if (currentStep === 3) return true; // Skills have default values
    if (currentStep === 4) return answers.careerValues.length > 0;
    if (currentStep === 5) return answers.academicStrengths.length > 0;
    return false;
  }, [state]);

  return {
    state,
    actions,
    canProceed
  };
}