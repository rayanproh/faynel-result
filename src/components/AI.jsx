import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  MoreHorizontal,
  Plus,
  Send,
  Loader2,
  Paperclip,
  MessageSquare,
  Clipboard,
  Edit,
  Repeat2,
  Pause,
  Sun,
  Moon,
  Trash2,
  Square
} from "lucide-react"

// --- ID Generator (for simplicity in single file environment) ---
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);


// --- Mock Data (Simplified) ---

const INITIAL_CONVERSATIONS = []

// --- Utility Components ---

const GhostIconButton = ({ children, label, className = "", onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors ${className}`}
  >
    {children}
  </button>
)

const ThemeToggle = ({ theme, setTheme }) => (
  <GhostIconButton
    label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark") )}
  >
    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </GhostIconButton>
)

// --- Header Component ---
const Header = ({ createNewChat }) => {
    return (
        <header className="flex items-center justify-between p-4 border-b border-zinc-800 flex-shrink-0 bg-black">
            <div className="text-lg font-semibold text-white">النسبية العامة EDU</div>
            <button onClick={createNewChat} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md">
                محادثة جديدة +
            </button>
        </header>
    )
}

const BlinkingCursor = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="inline-block w-1 h-5 bg-blue-500 ml-1"
        style={{ verticalAlign: 'text-bottom' }}
    />
);

const TypingIndicator = ({ thinking, isThinkingComplete = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="group flex w-full gap-3 py-4 px-6 transition-colors justify-start"
    >
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-zinc-700 to-zinc-800 text-blue-400 shadow-md`}>
            A
        </div>
        <div className={`flex-1 min-w-0 max-w-3xl`}>
            <div className={`rounded-2xl p-4 ${!isThinkingComplete ? "bg-gradient-to-r from-zinc-800 to-zinc-700" : "bg-gradient-to-r from-zinc-800 to-zinc-800"} text-zinc-100 shadow-lg shadow-zinc-900/30 border border-zinc-600/50 backdrop-blur`}>
                <h3 className={`font-semibold text-sm mb-2 text-right opacity-90`}>مساعد الذكاء الاصطناعي</h3>
                
                {/* Thinking box */}
                <div className={`border border-zinc-600/50 rounded-lg p-3 bg-zinc-800/70 mb-3 ${!isThinkingComplete ? "border-blue-500/30 shadow-md shadow-blue-900/20" : ""}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 ${!isThinkingComplete ? "bg-blue-400 animate-pulse" : "bg-zinc-500"} rounded-full`}></div>
                        <h4 className={`text-sm font-semibold ${!isThinkingComplete ? "text-blue-400" : "text-zinc-400"}`}>التفكير:</h4>
                    </div>
                    <div className={`text-sm ${!isThinkingComplete ? "text-zinc-200" : "text-zinc-300"} text-right`}>
                        {thinking ? (
                            thinking.split('\n').map((line, index) => (
                                <p key={index} className="my-1 whitespace-pre-wrap">{line}</p>
                            ))
                        ) : (
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                                <span className="text-zinc-300">جاري التفكير...</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse text-right">
                    <div className={`w-2 h-2 ${!isThinkingComplete ? "bg-blue-400 animate-pulse" : "bg-zinc-500"} rounded-full`}></div>
                    <span className={`${!isThinkingComplete ? "text-zinc-200" : "text-zinc-400"} text-sm`}>
                        {!isThinkingComplete ? "جاري كتابة الإجابة..." : "اكتمل التفكير، جاري تنسيق الإجابة..."}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 justify-end">
                <span>{new Date().toLocaleTimeString("ar-EG")}</span>
            </div>
        </div>
    </motion.div>
);

// --- Chat Components ---

const Message = ({ message, onEdit, onResend, isThinking }) => {
  const isUser = message.role === "user"
  const avatar = isUser ? "U" : "A" // User / Assistant
  const name = isUser ? "أنت" : "مساعد الذكاء الاصطناعي"

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const messageContainerClass = isUser ? "justify-end" : "justify-start";
  const messageBubbleClass = isUser 
    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30" 
    : "bg-gradient-to-r from-zinc-800 to-zinc-700 text-zinc-100 shadow-lg shadow-zinc-900/30 border border-zinc-600/50";
  const messageContentClass = isUser ? "text-right" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex w-full gap-3 py-4 px-6 transition-colors ${messageContainerClass}`}>
      
      {!isUser && (
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-zinc-700 to-zinc-800 text-blue-400 shadow-md`}>
          {avatar}
        </div>
      )}
      
      <div className={`flex-1 min-w-0 max-w-2xl`}>
        <div className={`rounded-2xl p-4 ${messageBubbleClass} backdrop-blur`}>
          <h3 className={`font-semibold text-sm mb-2 ${messageContentClass} opacity-90`}>{name}</h3>
          {/* Display thinking section if available */}
          {message.thinking && (
            <div className={`mb-4 border border-zinc-600/50 rounded-lg p-3 bg-zinc-800/50 ${!message.isThinkingComplete ? "border-blue-500/30 shadow-md shadow-blue-900/20" : ""}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 ${!message.isThinkingComplete ? "bg-blue-400 animate-pulse" : "bg-zinc-500"} rounded-full`}></div>
                <h4 className={`text-sm font-semibold ${!message.isThinkingComplete ? "text-blue-400" : "text-zinc-400"}`}>التفكير:</h4>
              </div>
              <div className={`text-sm ${!message.isThinkingComplete ? "text-zinc-200" : "text-zinc-300"} ${messageContentClass}`}>
                {message.thinking.split('\n').map((line, index) => (
                  <p key={index} className="my-1 whitespace-pre-wrap">{line}</p>
                ))}
                {!message.isThinkingComplete && (
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Display answer section */}
          <div className={`prose prose-invert max-w-none text-base ${messageContentClass} leading-relaxed`}>
            {message.answer ? (
              <>
                {message.answer.split('\n').map((line, index) => (
                  <p key={index} className="my-1 whitespace-pre-wrap">{line}</p>
                ))}
                {isThinking && !message.isThinkingComplete && (
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                )}
              </>
            ) : (
              <>
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className="my-1 whitespace-pre-wrap">{line}</p>
                ))}
                {isThinking && !message.isThinkingComplete && (
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-3 mt-2 text-xs text-zinc-500 ${messageContainerClass}`}>
          <span>{new Date(message.createdAt).toLocaleTimeString("ar-EG")}</span>
          {message.editedAt && <span>(تم التعديل)</span>}
        </div>
      </div>

      {isUser && (
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md`}>
          {avatar}
        </div>
      )}

      <div className="flex-shrink-0 flex flex-col items-center justify-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GhostIconButton label="Copy" onClick={handleCopy}>
          <Clipboard className="h-4 w-4" />
        </GhostIconButton>
        {isUser && (
          <GhostIconButton label="Edit" onClick={() => {
            const newContent = prompt("تعديل رسالتك:", message.content)
            if (newContent !== null && newContent !== message.content) {
                onEdit(message.id, newContent)
            }
          }}>
            <Edit className="h-4 w-4" />
          </GhostIconButton>
        )}
        {!isUser && (
          <GhostIconButton label="Regenerate" onClick={() => onResend(message.id)}>
            <Repeat2 className="h-4 w-4" />
          </GhostIconButton>
        )}
      </div>
    </motion.div>
  );
};

const MessageComposer = forwardRef(({ onSend, isThinking, onStopThinking, onFileAttach }, ref) => {
  const [input, setInput] = useState("")
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    insertTemplate: (content) => {
      setInput(content)
      textareaRef.current?.focus()
    },
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return
    onSend(input)
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(handleResize, [input])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileAttach(file);
    }
  };

  return (
    <div className="p-4 pt-0 md:p-6 md:pt-0 max-w-3xl mx-auto w-full">
      {isThinking && (
        <div className="flex justify-center mb-4">
          <button onClick={onStopThinking} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-zinc-700 to-zinc-800 text-white rounded-lg hover:from-zinc-600 hover:to-zinc-700 transition-all duration-200 font-semibold shadow-md">
            <Square className="h-4 w-4" />
            Stop Generation
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex items-end rounded-3xl p-3 border border-zinc-700/50 transition-all duration-200 bg-zinc-900/80 backdrop-blur-md shadow-2xl`}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        <GhostIconButton label="Attach file" className="p-2" onClick={() => fileInputRef.current.click()}>
          <Paperclip className="h-5 w-5" />
        </GhostIconButton>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="اسألني أي شيء..."
          className="flex-1 resize-none overflow-y-hidden text-base bg-transparent p-1.5 focus:outline-none text-white placeholder:text-zinc-500"
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          title="إرسال (Enter)"
          className={`p-3 ml-2 rounded-2xl transition-all duration-150 shadow-sm ${ 
            input.trim() && !isThinking
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-blue-900/30"
              : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
})

const ChatPane = forwardRef(({ conversation, onSend, onEditMessage, onResendMessage, isThinking, onStopThinking, createNewChat, onFileAttach }, ref) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages?.length, isThinking])

  const handlePromptClick = (prompt) => {
    onSend(prompt);
  };

  const messages = conversation?.messages || []
  const showWelcomeScreen = messages.length === 0 && !isThinking;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <div className="flex-1 overflow-y-auto">
        {showWelcomeScreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-white mb-4">مرحبا!</h1>
              <p className="text-xl text-zinc-300">كيف يمكنني مساعدتك اليوم؟</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              <button onClick={() => handlePromptClick("اشرح النسبية العامة")} className="p-4 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/70 hover:border-zinc-600 transition-all duration-200 shadow-md hover:shadow-lg">اشرح النسبية العامة</button>
              <button onClick={() => handlePromptClick("ما هو الثقب الأسود؟")} className="p-4 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/70 hover:border-zinc-600 transition-all duration-200 shadow-md hover:shadow-lg">ما هو الثقب الأسود؟</button>
              <button onClick={() => handlePromptClick("لخص نظرية كل شيء")} className="p-4 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/70 hover:border-zinc-600 transition-all duration-200 shadow-md hover:shadow-lg">لخص نظرية كل شيء</button>
              <button onClick={() => handlePromptClick("من هو ألبرت أينشتاين؟")} className="p-4 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/70 hover:border-zinc-600 transition-all duration-200 shadow-md hover:shadow-lg">من هو ألبرت أينشتاين؟</button>
            </div>
          </motion.div>
        )}
        
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onEdit={onEditMessage}
            onResend={onResendMessage}
            isThinking={isThinking}
          />
        ))}

        {isThinking && (() => {
          const lastMessage = conversation?.messages?.[conversation.messages.length - 1];
          return (
            <TypingIndicator 
              thinking={lastMessage?.thinking || ""} 
              isThinkingComplete={lastMessage?.isThinkingComplete || false}
            />
          );
        })()}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 border-t border-zinc-800 bg-black">
        <MessageComposer
          ref={ref}
          onSend={onSend}
          isThinking={isThinking}
          onStopThinking={onStopThinking}
          onFileAttach={onFileAttach}
        />
      </div>
    </div>
  )
})

const Sidebar = ({ conversations, selectedId, onSelect, onDeleteConversation }) => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-80 bg-black p-4 flex flex-col border-r border-zinc-800">
      <h2 className="text-lg font-semibold mb-4 text-zinc-200">سجل المحادثات</h2>
      <ul className="overflow-y-auto">
        {conversations.map(conv => (
          <li key={conv.id} onClick={() => onSelect(conv.id)} className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer text-zinc-300 truncate ${selectedId === conv.id ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800/50'}`}>
            <span className="truncate">{conv.title}</span>
            <GhostIconButton label="Delete" className="opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}>
              <Trash2 className="h-4 w-4" />
            </GhostIconButton>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}


// --- Main App Component ---

export default function AI() {
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("conversations");
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  const [selectedId, setSelectedId] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [thinkingConvId, setThinkingConvId] = useState(null)
  const composerRef = useRef(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id)
    } else if (!selectedId && conversations.length === 0) {
      createNewChat(false) // Don't select it, just create it
    }
  }, [conversations, selectedId])

  const selected = conversations.find((c) => c.id === selectedId) || null

  function createNewChat(select = true) {
    const id = generateId()
    const item = {
      id,
      title: "محادثة جديدة",
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: "",
      messages: [],
    }
    setConversations((prev) => [item, ...prev])
    if (select) {
      setSelectedId(id)
    }
  }

  function handleDeleteConversation(convId) {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (selectedId === convId) {
      const remainingConversations = conversations.filter(c => c.id !== convId);
      if (remainingConversations.length > 0) {
        setSelectedId(remainingConversations[0].id);
      } else {
        createNewChat();
      }
    }
  }

  async function sendMessage(convId, content) {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    
    const conv = conversations.find(c => c.id === convId);
    const history = conv ? (conv.messages || []).slice(-10) : []; // Last 5 turns

    const messagesForApi = [
        { role: 'system', content: 'First, think step-by-step in a "التفكير:" block. Then, give the final answer in an "الإجابة:" block. Both blocks are mandatory. Respond only in Moroccan Darija (colloquial Moroccan Arabic dialect) for the content inside the blocks.' },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: content }
    ];

    const userMsg = { id: generateId(), role: "user", content, createdAt: now };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = [...(c.messages || []), userMsg];
        const newTitle = c.title === "محادثة جديدة" ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : c.title;
        return {
          ...c,
          title: newTitle,
          messages: msgs,
          updatedAt: now,
          messageCount: msgs.length,
          preview: content.slice(0, 80),
        };
      })
    );
    if (!selectedId) {
      setSelectedId(convId);
    }

    setIsThinking(true);
    setThinkingConvId(convId);

    abortControllerRef.current = new AbortController();

    const asstMsgId = generateId();
    const asstMsg = {
      id: asstMsgId,
      role: "assistant",
      content: "",
      thinking: "",
      answer: "",
      isThinkingComplete: false,
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          messages: [...(c.messages || []), asstMsg],
        };
      })
    );

    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not set. Please add VITE_OPENROUTER_API_KEY to your .env file.');
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'General Relativity EDU',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4-fast:free',
        messages: messagesForApi,
        stream: true,
      }),
      signal: abortControllerRef.current.signal
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.substring(6);
            if (jsonStr === "[DONE]") {
              setIsThinking(false);
              setThinkingConvId(null);
              abortControllerRef.current = null;
              return;
            }
            try {
              const chunk = JSON.parse(jsonStr);
              if (chunk.choices && chunk.choices[0].delta && chunk.choices[0].delta.content) {
                const contentChunk = chunk.choices[0].delta.content;
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id !== convId) return c;
                    const newMessages = c.messages.map((m) => {
                      if (m.id === asstMsgId) {
                        // Check if we are still in the thinking phase
                        if (!m.isThinkingComplete) {
                          // Check if we have reached the answer section
                          if (m.thinking.includes("الإجابة:")) {
                            // Extract the thinking part before "الإجابة:"
                            const thinkingEndIndex = m.thinking.indexOf("الإجابة:");
                            const thinkingText = m.thinking.substring(0, thinkingEndIndex).replace("التفكير:", "").trim();
                            
                            // Start building the answer from the remaining content
                            const remainingContent = m.thinking.substring(thinkingEndIndex) + contentChunk;
                            const answerText = remainingContent.replace("الإجابة:", "").trim();
                            
                            return { 
                              ...m, 
                              thinking: thinkingText,
                              answer: answerText,
                              content: thinkingText + "\n\n" + answerText,
                              isThinkingComplete: true
                            };
                          } else {
                            // Still in thinking phase
                            return { ...m, thinking: m.thinking + contentChunk, content: m.thinking + contentChunk };
                          }
                        } else {
                          // In answer phase
                          return { 
                            ...m, 
                            answer: m.answer + contentChunk,
                            content: m.thinking + "\n\n" + (m.answer + contentChunk)
                          };
                        }
                      }
                      return m;
                    });
                    return { ...c, messages: newMessages };
                  })
                );
              }
            } catch (e) {
              console.error("Error parsing stream chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted by user');
      } else {
        console.error('Error fetching from OpenRouter:', error);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            const newMessages = c.messages.map((m) => {
              if (m.id === asstMsgId) {
                return { ...m, content: "خطأ في جلب النتيجة. يرجى التحقق من الكونسول." };
              }
              return m;
            });
            return { ...c, messages: newMessages };
          })
        );
      }
    } finally {
      setIsThinking(false);
      setThinkingConvId(null);
      abortControllerRef.current = null;
    }
  }

  function handleStopGeneration() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  function handleFileAttach(file) {
    console.log("Attached file:", file);
    alert("لم يتم تنفيذ إرفاق الملفات بعد.");
  }

  function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString()
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, editedAt: now } : m,
        )
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        }
      }),
    )
  }

  function resendMessage(convId, messageId) {
    const conv = conversations.find((c) => c.id === convId)
    const msgIndex = conv?.messages?.findIndex((m) => m.id === messageId)
    if (msgIndex === -1 || conv?.messages[msgIndex].role !== "assistant") return

    const userMsg = conv?.messages[msgIndex - 1]
    if (!userMsg || userMsg.role !== "user") return

    setConversations((prev) => prev.map(c =>
        c.id === convId ? { ...c, messages: c.messages.slice(0, msgIndex) } : c
    ))

    sendMessage(convId, userMsg.content)
  }

  return (
    <div className="h-screen w-full bg-black text-zinc-100 font-sans flex flex-col">
        <Header createNewChat={createNewChat} />
        <div className="flex flex-1 min-h-0">
            <Sidebar 
              conversations={conversations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDeleteConversation={handleDeleteConversation}
            />
            <main className="relative flex min-w-0 flex-1 flex-col h-full">
                <ChatPane
                    ref={composerRef}
                    conversation={conversations.find(c => c.id === selectedId)}
                    onSend={(content) => sendMessage(selectedId || conversations[0]?.id, content)}
                    onEditMessage={editMessage}
                    onResendMessage={resendMessage}
                    isThinking={isThinking && thinkingConvId === selectedId}
                    onStopThinking={handleStopGeneration}
                    createNewChat={createNewChat}
                    onFileAttach={handleFileAttach}
                />
            </main>
        </div>
    </div>
  )
}
