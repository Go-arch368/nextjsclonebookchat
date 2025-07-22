// components/modifier/chat-widget/ChatFooter.tsx
import { ChatWidgetSettings } from '@/types/Modifier';

interface ChatFooterProps {
  settings: ChatWidgetSettings;
}

export default function ChatFooter({ settings }: ChatFooterProps) {
  return (
    <div
      className="p-1 border-t text-center text-sm"
      style={{ color: settings.textColor || '#000000', backgroundColor: settings.bgColor || '#ffffff' }}
    >
      Powered by LiveChat
    </div>
  );
}