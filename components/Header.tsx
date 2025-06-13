
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="py-6 bg-slate-900/50 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <SparklesIcon className="w-10 h-10 text-sky-400 mr-3" />
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
          AI Creative Studio
        </h1>
      </div>
    </header>
  );
};

export default Header;
