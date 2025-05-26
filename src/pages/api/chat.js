import { sendChatMessage, createEducationalSystemPrompt } from '../../lib/openai.js';

export async function POST({ request }) {
  try {
    const requestData = await request.json();
    const { messages, subject, topic } = requestData;
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // システムプロンプトを追加
    const systemPrompt = createEducationalSystemPrompt(subject || '学校の勉強', topic || '一般');
    const allMessages = [systemPrompt, ...messages];
    
    // OpenAI APIにリクエスト
    const response = await sendChatMessage(allMessages);
    
    return new Response(JSON.stringify({
      message: response.choices[0].message,
      usage: response.usage
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 