// src/components/modifier/chatBar/ChatBarClient.tsx
"use client";

import { useState } from 'react';
import ChatBarPreview from './chatBarPreview';

type ChatBarSettings = {
  text: string;
  bgColor: string;
  textColor: string;
};

interface ChatBarClientProps {
  settings: ChatBarSettings;
  isDarkMode: boolean;
  loading: boolean;
}

export default function ChatBarClient({ settings, isDarkMode, loading }: ChatBarClientProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ChatBarPreview
      settings={settings}
      isDarkMode={isDarkMode}
      loading={loading}
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}