
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon }) => {
  const activeClasses = 'bg-sky-500 text-white shadow-md';
  const inactiveClasses = 'bg-slate-700 hover:bg-slate-600 text-slate-300';

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default TabButton;
