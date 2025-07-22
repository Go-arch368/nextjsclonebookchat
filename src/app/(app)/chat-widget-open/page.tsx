// src/app/chat-widget/page.tsx
import { ChatWidgetSettings } from '@/types/Modifier';
import ChatWidgetPreview from '@/components/chat-widget-open/ChatWidgetPreview';
import defaultConfig from '../../../../data/modifier.json';

export default function ChatWidgetPage() {
  const chatSettings: ChatWidgetSettings = defaultConfig.chatWidget;

  return (
    <div className="p-6">
      <ChatWidgetPreview 
        initialSettings={chatSettings}
        initialMessages={chatSettings.messages || []}
      />
    </div>
  );
}