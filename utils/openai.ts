import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey || apiKey === 'your_openai_key' || apiKey.startsWith('sk-your-')) {
  console.error('Invalid or missing OpenAI API key. Please set a valid key in your .env file.');
}

export const openai = new OpenAI({
  apiKey: apiKey,
  // Add fallback to prevent crashes
  onError: (error) => {
    console.error('OpenAI API Error:', error);
    return {
      choices: [{
        message: {
          content: "I apologize, but I'm having trouble connecting to the AI service. Please try again later or contact support."
        }
      }]
    };
  }
});

export const analyzeDocument = async (content: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal document expert. Analyze the following document and provide a clear summary in simple language."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};

export const chatWithAI = async (message: string, context: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a legal expert assistant. Use the following document context to answer questions: ${context}`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}; 