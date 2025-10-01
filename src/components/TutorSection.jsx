import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, RefreshCw } from 'lucide-react';
import { sendMessage, resetChat } from '../lib/gemini';
import './Chatbot.css';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from './ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TutorSection() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // Effect for auto-scrolling and saving messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      if (messages.length > 1) {
        try {
          // Don't save streaming messages to history
          const messagesToSave = messages.map(msg => ({ ...msg, streaming: false }));
          localStorage.setItem('gemini-chat-history', JSON.stringify(messagesToSave));
        } catch (error) {
          console.error("Failed to save messages to local storage", error);
        }
      }
    }
  }, [messages]);

  const handleReset = () => {
    resetChat();
    setMessages([
      {
        text: t('welcome_message'),
        sender: 'bot',
        streaming: false,
      },
    ]);
    // Clear history from local storage
    try {
      localStorage.removeItem('gemini-chat-history');
    } catch (error) {
      console.error("Failed to remove messages from local storage", error);
    }
  };

  // Effect to load messages from local storage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('gemini-chat-history');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (parsedMessages.length > 0) {
          setMessages(parsedMessages);
        } else {
          handleReset();
        }
      } else {
        handleReset();
      }
    } catch (error) {
      console.error("Failed to load messages from local storage", error);
      handleReset();
    }
  }, [t]); // Keep t to reset on language change

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    const botMessage = { text: '...', sender: 'bot', streaming: true };
    
    setMessages((prev) => [...prev, userMessage, botMessage]);
    scrollToBottom();
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessage(currentInput);
      let fullResponse = "";
      let lastUpdateTime = 0;
      const updateInterval = 50; // ms

      for await (const chunk of stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        const now = Date.now();
        if (now - lastUpdateTime > updateInterval) {
          lastUpdateTime = now;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponse;
            return newMessages;
          });
        }
      }
      // Final update to ensure the full text is displayed
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = fullResponse;
        return newMessages;
      });

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { text: 'Sorry, I am having trouble connecting. Please try again.', sender: 'bot', streaming: false };
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = errorMessage;
        return newMessages;
      });
    } finally {
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].streaming = false;
        }
        return newMessages;
      });
      setIsLoading(false);
      setTimeout(scrollToBottom, 0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-row items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('tutor_title')}</h2>
          <p className="text-blue-200">{t('tutor_subtitle')}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset} className="text-slate-400 hover:text-white">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      <div className="chatbot-window-page" style={{ height: 'calc(100vh - 250px)' }}>
        <ScrollArea className="h-full">
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender} whitespace-pre-wrap`}>
                  <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Fix for rendering tables inside the chat
                      table: ({node, ...props}) => <table className="table-auto w-full" {...props} />,
                      thead: ({node, ...props}) => <thead className="bg-slate-800" {...props} />,
                      th: ({node, ...props}) => <th className="p-2 border border-slate-600" {...props} />,
                      td: ({node, ...props}) => <td className="p-2 border border-slate-600" {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  </div>
                  {msg.streaming && <span className="blinking-cursor"></span>}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('chatbot_placeholder')}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}