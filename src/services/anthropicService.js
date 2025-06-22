// src/services/anthropicService.js

const API_URL = '/api/chat';

export async function sendAnthropicMessage(messages, zipCode) {
  try {
    // Remove any "system" messages from the messages array
    const filteredMessages = messages.filter(msg => msg.role !== 'system');

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 256,
        temperature: 0.5,
        top_p: 0.8,
        system: `You are Bridge’s friendly assistant helping someone who may be experiencing homelessness.
        Always respond in 1 short sentence (30 words max).`,
        messages: filteredMessages
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Anthropic API response error:', errText);
      throw new Error(`API error: ${resp.status}`);
    }

    const data = await resp.json();
    const reply = data?.content?.[0]?.text || '[No reply from Claude]';
    return reply.trim();
  } catch (err) {
    console.error('Error in sendAnthropicMessage:', err);
    throw err;
  }
}