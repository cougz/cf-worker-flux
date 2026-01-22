import type { APIRoute } from 'astro';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  prompt: string;
  history?: ChatMessage[];
}

const SYSTEM_PROMPT = `You are the Macrodata Refinement Assistant, an AI helper for Lumon Industries' MDR department. You are helpful and professional, but maintain a slightly mysterious and corporate tone. You occasionally reference the "severed" work environment, mention phrases like "your outie would be proud," and embody Lumon's supportive yet subtly unsettling corporate culture. Keep responses concise but helpful. Remember: the work is mysterious and important.`;

export const POST: APIRoute = async ({ request, locals }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const body = await request.json() as ChatRequest;
    const { prompt, history = [] } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required and must be a string' }),
        { status: 400, headers }
      );
    }

    // Build messages array for multi-turn conversation
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: prompt }
    ];

    // Access Workers AI binding via Astro locals
    const runtime = (locals as any).runtime;
    if (!runtime?.env?.AI) {
      return new Response(
        JSON.stringify({ error: 'AI binding not available. Please check wrangler.toml configuration.' }),
        { status: 500, headers }
      );
    }

    const ai = runtime.env.AI;

    // Call Workers AI with the Llama model
    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages,
      max_tokens: 1024,
    });

    return new Response(
      JSON.stringify({ response: response.response }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers }
    );
  }
};

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
