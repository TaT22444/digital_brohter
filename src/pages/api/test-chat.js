import { createEducationalSystemPrompt } from '../../lib/openai.js';
import { getAssignmentById, assignmentsData } from '../../lib/assignmentData.js';

export async function GET({ request, url }) {
  try {
    const topicId = url.searchParams.get('topic') || 'math-1';
    
    // 課題の詳細情報を取得
    const assignmentDetails = getAssignmentById(topicId);
    
    if (!assignmentDetails) {
      return new Response(JSON.stringify({ 
        error: 'Assignment not found', 
        availableTopics: assignmentsData.map(a => a.id)
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // システムプロンプトを作成
    const systemPrompt = createEducationalSystemPrompt(
      assignmentDetails.subject || '学校の勉強', 
      assignmentDetails.title,
      assignmentDetails.description
    );
    
    return new Response(JSON.stringify({
      assignment: assignmentDetails,
      systemPrompt: systemPrompt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 