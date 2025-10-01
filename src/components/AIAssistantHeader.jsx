import React from 'react';

const AIAssistantHeader = ({ createNewChat, sidebarCollapsed, setSidebarOpen }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <button onClick={() => setSidebarOpen(true)} className="md:hidden">
        Menu
      </button>
      <h1 className="text-lg font-semibold">AI Assistant</h1>
      <button onClick={createNewChat}>New Chat</button>
    </div>
  );
};

export default AIAssistantHeader;
