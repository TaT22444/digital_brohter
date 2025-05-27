import { sendChatMessage, createEducationalSystemPrompt } from '../../lib/openai.js';
import { getAssignmentById } from '../../lib/assignmentData.js';

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
    
    // 課題の詳細情報を取得
    const assignmentDetails = getAssignmentById(topic);
    const assignmentTitle = assignmentDetails?.title || topic;
    const assignmentDescription = assignmentDetails?.description || '';
    
    // システムプロンプトを追加
    const systemPrompt = createEducationalSystemPrompt(
      subject || '学校の勉強', 
      assignmentTitle,
      assignmentDescription
    );
    
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