const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const difficultyInstructions = {
    easy: 'Make the questions beginner-friendly and straightforward. Focus on basic concepts and definitions.',
    medium: 'Make the questions moderately challenging. Include application-based and conceptual questions.',
    hard: 'Make the questions very challenging. Include tricky edge cases, advanced concepts, and questions that require deep understanding.',
};

export async function generateQuestions(topic, count = 10, difficulty = 'medium') {
    const prompt = `Generate exactly ${count} multiple choice quiz questions about "${topic}". 

Difficulty level: ${difficulty.toUpperCase()}
${difficultyInstructions[difficulty]}

IMPORTANT: Return ONLY a valid JSON array, no markdown, no code fences, no explanation. Each element must be an object with these exact fields:
- "question": the question text (string)
- "options": an array of exactly 4 option strings
- "correctAnswer": the index (0-3) of the correct option
- "explanation": a brief 1-2 sentence explanation of WHY the correct answer is right

Example format:
[{"question":"What is X?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"A is correct because..."}]

Make the questions educational, progressively harder within the ${difficulty} range, and ensure all 4 options are plausible. The correct answer must be accurate. The explanation should be clear and educational.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a quiz question generator. Always respond with valid JSON only, no markdown formatting.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 0.8 : 0.7,
                max_tokens: 6000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error('No response from AI');
        }

        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const questions = JSON.parse(cleaned);

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error('Invalid response format from AI');
        }

        return questions.map((q, idx) => ({
            id: idx + 1,
            question: q.question,
            options: q.options.slice(0, 4),
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
            explanation: q.explanation || 'No explanation available.',
        }));
    } catch (error) {
        console.error('AI generation error:', error);
        throw new Error(`Failed to generate questions: ${error.message}`);
    }
}
