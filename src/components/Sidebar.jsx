import React from 'react';

const Sidebar = ({ open, onClose, theme, setTheme, collapsed, setCollapsed, sidebarCollapsed, setSidebarCollapsed, conversations, pinned, recent, folders, folderCounts, selectedId, onSelect, togglePin, query, setQuery, searchRef, createFolder, createNewChat, templates, setTemplates, onUseTemplate }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <div className="mt-4">
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
          />
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Pinned</h3>
          <ul>
            {pinned.map(conv => (
              <li key={conv.id} onClick={() => onSelect(conv.id)} className={`p-2 cursor-pointer ${selectedId === conv.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                {conv.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Recent</h3>
          <ul>
            {recent.map(conv => (
              <li key={conv.id} onClick={() => onSelect(conv.id)} className={`p-2 cursor-pointer ${selectedId === conv.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                {conv.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <button onClick={createNewChat} className="w-full p-2 bg-blue-500 text-white rounded">
            New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
