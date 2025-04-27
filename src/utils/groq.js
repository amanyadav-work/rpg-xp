// lib/groq.js
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GenerateAiData = async (message) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile', 
    });

    const text = completion.choices[0].message.content;

    // Clean code block formatting if Groq returns markdown-style JSON
    const cleaned = text.replace(/```(?:json)?\n?/g, '').replace(/```$/, '').trim();

    const result = JSON.parse(cleaned);
    return result;
  } catch (error) {
    console.error('[GROQ AI ERROR]', error);
    return null;
  }
};
