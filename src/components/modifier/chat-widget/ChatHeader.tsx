// components/modifier/chat-widget/ChatHeader.tsx
import { ChatWidgetSettings } from '@/types/Modifier';

interface ChatHeaderProps {
  settings: ChatWidgetSettings;
}

export default function ChatHeader({ settings }: ChatHeaderProps) {
  return (
    <div
      className="p-3 border-b flex justify-between items-center"
      style={{ color: settings.textColor || '#000000' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300" />
        <span>LiveChat</span>
      </div>
    </div>
  );
}