import React, { useState, useEffect } from 'react';
import { sendAnthropicMessage } from '../services/anthropicService';
import { buildContext } from '../services/contextService';

// CHANGE: Added props: zip, category, places
export default function Chatbot({ zip, category, places }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'What can I assist you today?' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (zip && category && places?.length > 0) {
      
      // map category to a more specific prompt phrase
      const promptMap = {
        food: 'food pantries',
        water: 'water stations',
        'free wi-fi': 'places with free wifi',
        shelters: 'community shelters',
        healthcare: 'healthcare facilities',
        showers: 'shower facilities',
        jobs: 'job center'
      };
      const specific = promptMap[category] || category;
      handleSend(`Find three ${specific} near ${zip}`);
    }
  }, [zip, category, places]);

  const handleSend = async (promptText) => {
    const textContent = promptText ?? input.trim();
    if (!textContent) return;
    const userMsg = { role: 'user', content: textContent };
   
    const convo   = [...messages, userMsg];
    setMessages(convo);
    setInput('');
    setLoading(true);
    try {
      // CHANGE: Build context if we have location data
      let context = null;
      if (zip && zip.length === 5) {
        context = await buildContext(zip);
      }
      
      // CHANGE: Pass context to sendAnthropicMessage
      const reply = await sendAnthropicMessage(convo, context);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection failure.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full bg-gray-50 border-t p-2 pt-2 pb-12">
      <div className="w-full md:w-2/3 flex flex-col h-[330px] max-h-[330px] overflow-y-auto">
        <div className="flex-1 overflow-y-auto mb-2 space-y-2">
          {messages.map((m, i) => {
            if (m.role === 'user' && messages[i + 1]?.role === 'assistant') {
              return (
                <div key={i} className="flex justify-between items-start space-x-4 w-full">
                  <div className="w-1/4 p-3 bg-blue-100 text-left rounded self-start justify-start">
                    {m.content}
                  </div>
                  <div className="w-3/4 p-3 bg-white text-left rounded shadow-sm self-start justify-end">
                    {messages[i + 1].content}
                  </div>
                </div>
              );
            }
            if (m.role === 'user' && !messages[i + 1]) {
              return (
                <div key={i} className="flex w-full justify-start">
                  <div className="w-1/4 p-3 bg-blue-100 text-left rounded">
                    {m.content}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="flex w-full">
          <input
            className="flex-1 border rounded-l px-3 py-2 w-full"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your question…"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="px-4 bg-blue-500 text-white rounded-r w-full sm:w-auto"
          >
            {loading ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}