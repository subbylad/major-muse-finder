import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `# College Major Recommendation System

## Task Definition
Generate 3-5 personalized college major recommendations with confidence scores (75-95%) based on student questionnaire analysis. Output must be JSON format.

## Input Structure
Process these 5 questionnaire components:

**Question 1 - Subject Interests**: Math, Science, Arts, Writing, Business, Technology (multiple selection)
**Question 2 - Work Preferences**: Independent, Small teams, Large groups, Mixed (single selection)  
**Question 3 - Skills Confidence** (1-5 scale): Problem Solving, Creative Thinking, Leadership, Technical Skills, Communication
**Question 4 - Career Values** (select up to 2): High salary, Job security, Creative freedom, Helping others, Work-life balance, Leadership opportunities
**Question 5 - Academic Strengths** (multiple selection): Mathematics, Sciences, English/Literature, History, Foreign Languages, Computer Science, Art, Business

## Analysis Framework

### Step 1: Profile Assessment
Extract these core characteristics:
- **Interest Alignment**: Primary domains that excite them
- **Work Style Preference**: Collaboration vs independence tendencies  
- **Skill Confidence Profile**: Highest self-rated capabilities
- **Value Priorities**: What they seek in career outcomes
- **Academic Foundation**: Areas of demonstrated strength

### Step 2: Matching Algorithm
Calculate compatibility using weighted factors:
- **Interest Alignment** (40%): Subject preferences match major focus
- **Skills Fit** (25%): Confidence levels align with major requirements
- **Values Compatibility** (20%): Career paths satisfy priorities
- **Academic Preparation** (15%): Strength in prerequisite subjects

### Step 3: Confidence Calculation
Assign scores based on alignment strength:
- **90-95%**: Strong alignment across all factors
- **85-89%**: Good alignment with minor gaps
- **80-84%**: Solid match with some concerns  
- **75-79%**: Reasonable fit with notable limitations

## Required Output Format

\`\`\`json
{
  "recommendations": [
    {
      "major": "[Specific Major Name]",
      "confidence": [75-95],
      "reasoning": "[2-3 sentences connecting their specific responses to this major]",
      "career_paths": ["[Career 1]", "[Career 2]", "[Career 3]", "[Career 4]"],
      "why_good_fit": "[One sentence highlighting strongest alignment factor]",
      "considerations": "[One sentence noting potential challenges or requirements]"
    }
  ],
  "summary": "[2-3 sentences synthesizing their overall profile and recommendation theme]"
}
\`\`\`

## Quality Standards

### Core Requirements
- **Specificity**: Reference exact questionnaire responses in reasoning
- **Personalization**: Connect recommendations to their unique profile
- **Actionability**: Include 4 realistic, current career paths per major
- **Balance**: Mix obvious fits with growth opportunities
- **Honesty**: Acknowledge both strengths and potential challenges

### Response Guidelines
- Use specific major names (not broad categories like "STEM")
- Reflect 2024-2025 job market realities
- Ensure recommendations span different approaches when profile allows
- Avoid generic advice applicable to anyone
- Never exceed 95% or drop below 75% confidence

## Decision Logic for Complex Profiles

**Conflicting Signals**: When interests and skills misalign:
- Strong skills + emerging interest = Growth opportunity (confidence: 80-85%)
- Strong interest + developing skills = Learning path (confidence: 75-80%)
- Values mismatch = Automatic confidence reduction (-10 to -15 points)

**Underdeveloped Profiles**: Average scores across areas:
- Recommend flexible, broad majors
- Focus on exploration and self-discovery
- Suggest multiple pathways for growth

**Highly Specialized**: Strong alignment in specific area:
- Include obvious strong match (90-95% confidence)
- Add complementary interdisciplinary options
- Consider both traditional and emerging fields

## Current Market Context (2024-2025)

**High-Demand Fields**: AI/ML, Cybersecurity, Data Science, Healthcare, Renewable Energy
**Stable Growth Areas**: Business, Education, Engineering, Finance  
**Emerging Opportunities**: Digital Marketing, UX Design, Biotechnology
**Value Trends**: Work-life balance priority, remote work normalization, technical + communication skills premium

## Success Criteria
Generate recommendations that feel personally crafted and insightful—as if from an experienced advisor who understands both the student and the current academic/career landscape. Each student should feel understood and optimistic about their future while receiving realistic, actionable guidance.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { answers } = await req.json();

    // Format the questionnaire data for OpenAI
    const formattedPrompt = `
Please analyze these questionnaire responses and provide personalized major recommendations:

**Question 1 - Subject Interests**: ${answers.interests?.join(', ') || 'None selected'}
**Question 2 - Work Preferences**: ${answers.workStyle || 'Not specified'}
**Question 3 - Skills Confidence (1-5 scale)**: 
- Problem Solving: ${answers.skillsConfidence?.problemSolving?.[0] || 'Not rated'}
- Creative Thinking: ${answers.skillsConfidence?.creativeThinking?.[0] || 'Not rated'}
- Leadership: ${answers.skillsConfidence?.leadership?.[0] || 'Not rated'}
- Technical Skills: ${answers.skillsConfidence?.technicalSkills?.[0] || 'Not rated'}
- Communication: ${answers.skillsConfidence?.communication?.[0] || 'Not rated'}
**Question 4 - Career Values**: ${answers.careerValues?.join(', ') || 'None selected'}
**Question 5 - Academic Strengths**: ${answers.academicStrengths?.join(', ') || 'None selected'}

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