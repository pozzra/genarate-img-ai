
import React from 'react';

interface IconProps {
  className?: string;
}

export const MagicWandIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-3.022 2.65L4 20l.94-2.427A4.5 4.5 0 0110.153 14H11a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h1.47a4.5 4.5 0 015.06 2.122zM16 4.455V2.127a4.5 4.5 0 00-4.708 0L9.167 4.455m0 0a4.5 4.5 0 004.708 0M19.5 9l-1.378-1.378A4.5 4.5 0 0013.5 6.095m0 0a4.5 4.5 0 00-4.577 1.527L7.5 9m12 0l-1.378 1.378A4.5 4.5 0 0113.5 11.905m0 0a4.5 4.5 0 01-4.577-1.527L7.5 9" />
  </svg>
);
