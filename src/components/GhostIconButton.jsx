import React from 'react';

const GhostIconButton = ({ children, label }) => (
  <button title={label} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full">
    {children}
  </button>
);

export default GhostIconButton;
