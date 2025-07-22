// components/modifier/CloseButton.tsx
'use client';

import { useState } from 'react';

interface CloseButtonProps {
  headingColor: string;
}

const CloseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
    <path d="M17.4,16l5.3,5.3c0.4,0.4,0.4,1,0,1.4c-0.4,0.4-1,0.4-1.4,0L16,17.4l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0 c-0.4-0.4-0.4-1,0-1.4l5.3-5.3l-5.3-5.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4,0.4,1-0.4,1.4,0 c0.4,0.4,0.4,1,0,1.4L17.4,16z" />
  </svg>
);

export default function CloseButton({ headingColor }: CloseButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button aria-label="Hide greeting" style={{ color: headingColor }}>
        <CloseIcon />
      </button>
    </div>
  );
}