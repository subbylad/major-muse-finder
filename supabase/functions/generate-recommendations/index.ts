import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `# Research-Based College Major Recommendation System

## Core Objective
Generate 4 evidence-based college major recommendations using validated psychological predictors. Output confidence scores (75-95%) based on research-proven assessment framework.

## Assessment Framework

### Research-Validated Predictors (Weighted by Predictive Power)

**1. Conscientiousness Pattern Assessment (40% weight)**
- **High Predictor**: Self-regulation style, consistency patterns, goal management
- **Application**: Match conscientiousness style to field demands
  - Steady/Structured → Research, Healthcare, Engineering
  - Intensive/Flexible → Business, Creative fields, Entrepreneurship
- **Note**: High conscientiousness predicts success across ALL majors

**2. Holland Code Interest Mapping (25% weight - 50.8% validated hit rate)**
- **RIASEC Classification**: Identify primary and secondary interest patterns
  - R+I (Realistic+Investigative) → Engineering, Sciences
  - S+A (Social+Artistic) → Education, Arts, Counseling
  - E+C (Enterprising+Conventional) → Business, Finance, Management
- **Profile Analysis**: Strong primary codes vs flat profiles indicate recommendation confidence

**3. Problem-Solving Style Analysis (20% weight)**
- **Systematic/Reflective** → Research, Engineering, Medical specialties
- **Iterative/Action-Oriented** → Business, Healthcare, Applied fields  
- **Collaborative** → Education, Social services, Management

**4. Work-Life Integration Preferences (10% weight)**
- Geographic mobility tolerance
- Risk vs security preferences  
- Structure vs autonomy needs
- Work-life balance priorities

**5. Experiential Readiness (5% weight)**
- Prior field exposure level
- Readiness for major commitment
- Misconceptions requiring address

## Required Input Processing

<input_structure>
Extract and analyze:
- **Conscientiousness indicators**: Time management, goal persistence, organization style
- **Interest patterns**: Subject preferences mapped to RIASEC codes
- **Problem-solving approach**: Preferred methods and collaboration style
- **Lifestyle preferences**: Work environment, balance, and mobility factors
- **Experience level**: Exposure to potential fields and exploration readiness
</input_structure>

## Output Format

\`\`\`json
{
  "recommendations": [
    {
      "major": "[Specific Major Name]",
      "confidence": [75-95],
      "primary_matching_factors": "[Reference specific conscientiousness + Holland code alignment]",
      "career_paths": [
        {
          "role": "[Career Title]",
          "work_environment": "[Specific workplace description]"
        }
      ],
      "educational_pathway": "[Degree requirements and timeline]",
      "conscientiousness_fit": "[How their self-regulation style matches field demands]",
      "problem_solving_alignment": "[Connection to their preferred approach]",
      "considerations": "[Potential challenges and mitigation strategies]"
    }
  ],
  "overall_profile": "[Conscientiousness style + dominant Holland codes + problem-solving preference]"
}
\`\`\`

## Confidence Scoring Guidelines

**90-95%**: Strong conscientiousness match + clear primary Holland code + aligned problem-solving style
**85-89%**: Good conscientiousness fit + moderate Holland alignment + some style match
**80-84%**: Adequate conscientiousness + mixed Holland signals + partial style fit
**75-79%**: Conscientiousness concerns OR weak Holland match OR style mismatch

## Decision Logic for Complex Profiles

### Low Conscientiousness Profiles
- **Strategy**: Recommend structure-supporting majors
- **Examples**: Programs with built-in accountability, externally imposed deadlines
- **Approach**: Address with supportive academic environments

### Flat Holland Profiles  
- **Strategy**: Focus on conscientiousness and problem-solving style
- **Recommendation**: Broad, flexible majors allowing exploration
- **Confidence**: Reduce by 5-10 points due to unclear interest direction

### Work-Life Mismatches
- **Detection**: Lifestyle preferences conflict with field realities
- **Action**: Flag in considerations section
- **Impact**: Automatic confidence reduction of 10-15 points

### Limited Experience Profiles
- **Approach**: Suggest exploration before major commitment
- **Recommendations**: Include experiential learning opportunities
- **Note**: Address specific misconceptions about fields

## Quality Standards

### Research-Based Requirements
- Reference validated psychological predictors in reasoning
- Connect recommendations to specific response patterns
- Include realistic work environment descriptions
- Acknowledge field-specific challenges based on their profile

### Specificity Standards
- Name actual majors and career roles
- Describe concrete work environments
- Provide specific educational pathways
- Reference their exact conscientiousness and problem-solving patterns

## Examples

<example_analysis>
**Profile**: High conscientiousness (structured style) + R+I Holland codes + systematic problem-solving + security-oriented work-life preferences + moderate field exposure

**Analysis**: Strong predictor alignment with technical fields requiring sustained attention and systematic approaches. Security orientation matches stable career trajectories in engineering/sciences.

**Top Recommendation**: 
- Major: Mechanical Engineering (92% confidence)
- Primary factors: High conscientiousness matches rigorous curriculum demands, R+I codes align perfectly with hands-on technical work
- Conscientiousness fit: Structured style suits systematic design processes and project management requirements
</example_analysis>

## Critical Considerations

### Must Address
- **Low conscientiousness**: Never ignore - recommend supportive structures
- **Work-life conflicts**: Flag geographic, risk, or balance mismatches  
- **Experience gaps**: Identify field misconceptions needing correction
- **Style mismatches**: Note when problem-solving approach conflicts with field norms

### Avoid
- Generic advice applicable to any student
- Recommendations ignoring conscientiousness patterns
- Career paths without work environment context
- Suggestions exceeding student's experiential readiness

## Success Criteria
Generate recommendations that demonstrate deep understanding of research-validated predictors while connecting directly to the student's specific response patterns. Each recommendation should feel psychologically grounded and practically actionable.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { answers } = await req.json();

    // Format the new questionnaire data for OpenAI
    const formattedPrompt = `
Please analyze these questionnaire responses and provide personalized major recommendations:

**Question 1 - Work Approach & Conscientiousness**: 
- Work Approach: ${answers.workApproach || 'Not specified'}
- Commitment Reliability (1-5): ${answers.commitmentReliability?.[0] || 'Not rated'}

**Question 2 - Holland Code Interest Ranking** (Most to Least Interesting):
${answers.hollandCodeRanking?.map((code, index) => `${index + 1}. ${code}`).join('\n') || 'Not ranked'}

**Question 3 - Problem-Solving Style**: 
- Problem-Solving Approach: ${answers.problemSolvingApproach || 'Not specified'}
- Group Project Role: ${answers.groupProjectRole || 'Not specified'}

**Question 4 - Work-Life Integration**: 
- Preferred Scenarios: ${answers.workLifeScenarios?.join(', ') || 'None selected'}
- Uncertainty Comfort (1-5): ${answers.uncertaintyComfort?.[0] || 'Not rated'}

**Question 5 - Field Exposure & Experience**: 
- Field Exposure: ${answers.fieldExposure?.join(', ') || 'None selected'}
- Field Surprise: ${answers.fieldSurprise || 'Not specified'}

Please provide your response in the exact JSON format specified in the system prompt.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: formattedPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the JSON response from OpenAI
    let recommendations;
    try {
      // Extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = aiResponse.match(/```json\n(.*?)\n```/s) || aiResponse.match(/\{.*\}/s);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
      recommendations = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', aiResponse);
      throw new Error('Failed to parse AI recommendations');
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: {
        recommendations: [
          {
            major: "Exploratory Studies",
            confidence: 75,
            reasoning: "Based on your responses, an exploratory program would help you discover your true passions while building foundational skills.",
            career_paths: ["Academic Advisor", "Research Assistant", "Program Coordinator", "Student Services Specialist"],
            why_good_fit: "Allows time for self-discovery while exploring multiple fields",
            considerations: "Consider this a stepping stone to finding your ideal major"
          }
        ],
        summary: "We encountered an issue generating your personalized recommendations. Please try again or consider speaking with an academic advisor for personalized guidance."
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});