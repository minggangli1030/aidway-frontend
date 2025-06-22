// src/services/anthropicService.js

const API_URL = '/api/chat';

export async function sendAnthropicMessage(messages, context) {
  try {
    // If we have context, inject it into the last user message
    let enhancedMessages = [...messages];
    
    if (context && messages.length > 0) {
      const lastUserMsgIndex = enhancedMessages.map((m, i) => m.role === 'user' ? i : -1)
        .filter(i => i !== -1)
        .pop();
      
      if (lastUserMsgIndex !== undefined) {
        const contextInfo = `[Context: ZIP ${context.location.zip}, ${context.time.current}, ${context.weather?.temperature || 'unknown weather'}, ${context.location.openNow} places open now] `;
        enhancedMessages[lastUserMsgIndex] = {
          ...enhancedMessages[lastUserMsgIndex],
          content: contextInfo + enhancedMessages[lastUserMsgIndex].content
        };
      }
    }

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 512,
        temperature: 0.3,
        system: "You help homeless people find resources. Use the specific location and time context provided in brackets. Please format your answer as a numbered list and include the specific location and time context provided in brackets. Be specific, not generic.",
        messages: enhancedMessages
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Anthropic API response error:', errText);
      throw new Error(`API error: ${resp.status}`);
    }

    const data = await resp.json();
    let reply = data?.content?.[0]?.text || '[No reply from Claude]';
    

    
    return reply.trim();
  } catch (err) {
    console.error('Error in sendAnthropicMessage:', err);
    throw err;
  }
}