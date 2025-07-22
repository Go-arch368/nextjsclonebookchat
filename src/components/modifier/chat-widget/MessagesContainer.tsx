// src/components/modifier/chat-widget/MessagesContainer.tsx
'use client';
import { ChatWidgetSettings, Message } from '@/types/Modifier';

interface MessagesContainerProps {
  messages: Message[];
  settings: ChatWidgetSettings;
}

export default function MessagesContainer({ messages = [], settings }: MessagesContainerProps) {
  return (
    <div id="messagesContainer" className="p-4 flex-1 overflow-y-auto">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block p-2 rounded ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              style={{
                backgroundColor: msg.isUser ? (settings.userMsgBgColor || '#3b82f6') : (settings.botMsgBgColor || '#e5e7eb'),
                color: msg.isUser ? '#ffffff' : (settings.textColor || '#000000'),
              }}
            >
              {msg.text}
            </span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No messages yet</div>
      )}
    </div>
  );
}