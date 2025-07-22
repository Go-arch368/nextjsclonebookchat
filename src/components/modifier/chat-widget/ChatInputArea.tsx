// src/components/modifier/chat-widget/ChatInputArea.tsx
import { ChatWidgetSettings } from '@/types/Modifier';

interface ChatInputAreaClientProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: () => void;
  settings: ChatWidgetSettings;
  disabled: boolean;
}

export default function ChatInputAreaClient({
  newMessage,
  setNewMessage,
  onSendMessage,
  settings,
  disabled,
}: ChatInputAreaClientProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSendMessage();
    }
  };

  return (
    <div className="p-3 border-t" style={{ backgroundColor: settings.bgColor || '#ffffff' }}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={settings.inputPlaceholder || 'Type a message...'}
          className="flex-1 p-2 rounded-md border"
          style={{ borderColor: settings.sendBtnBgColor || '#000000' }}
          disabled={disabled}
        />
        <button
          onClick={onSendMessage}
          className="p-2 rounded-md"
          style={{
            backgroundColor: settings.sendBtnBgColor || '#000000',
            color: settings.sendBtnIconColor || '#ffffff',
          }}
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </div>
  );
}