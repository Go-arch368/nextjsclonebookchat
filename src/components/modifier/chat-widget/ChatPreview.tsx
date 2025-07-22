// src/components/modifier/chat-widget/ChatPreview.tsx
'use client';
import { ChatWidgetSettings, Message } from '@/types/Modifier';
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import ChatInputAreaClient from './ChatInputArea';
import ChatFooter from './ChatFooter';

interface ChatPreviewProps {
  settings: ChatWidgetSettings;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: () => void;
  isSaving: boolean;
}

export default function ChatPreview({
  settings,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  isSaving,
}: ChatPreviewProps) {
  return (
    <div
      className="flex flex-col h-[700px] w-[370px] border rounded-lg overflow-hidden"
      style={{ backgroundColor: settings.bgColor || '#ffffff' }}
    >
      <ChatHeader settings={settings} />
      <MessagesContainer messages={messages} settings={settings} />
      <ChatInputAreaClient
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={onSendMessage}
        settings={settings}
        disabled={isSaving}
      />
      <ChatFooter settings={settings} />
    </div>
  );
}