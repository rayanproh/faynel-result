import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const Composer = forwardRef((props, ref) => {
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    insertTemplate: (content) => {
      if (textareaRef.current) {
        textareaRef.current.value += content;
      }
    },
  }));

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800">
      <textarea ref={textareaRef} className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700" rows="4" />
      <button onClick={() => props.onSend(textareaRef.current.value)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
});

const ChatPane = forwardRef(({ conversation, onSend, onEditMessage, onResendMessage, isThinking, onPauseThinking }, ref) => {
  const composerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    insertTemplate: (content) => {
      composerRef.current.insertTemplate(content);
    },
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {conversation && conversation.messages && conversation.messages.map(msg => (
          <div key={msg.id} className={`p-2 my-2 rounded ${msg.role === 'user' ? 'bg-blue-200 dark:bg-blue-900 ml-auto' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <p>{msg.content}</p>
          </div>
        ))}
        {isThinking && <div className="p-2 my-2 rounded bg-gray-200 dark:bg-gray-700">Thinking...</div>}
      </div>
      <Composer ref={composerRef} onSend={onSend} />
    </div>
  );
});

export default ChatPane;
