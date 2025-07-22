// src/app/(app)/chat-bar/page.tsx
import ChatBarClient from "@/components/modifier/chatBar/chatBarClient";

export default function ChatBarPage() {
  const chatBarSettings = {
    text: 'Chat with us',
    bgColor: '#007bff',
    textColor: '#ffffff',
    // ... other chat bar settings
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Bar Page</h1>
      <ChatBarClient
        settings={chatBarSettings}
        isDarkMode={false} // Set based on your theme detection
        loading={false} // Set based on your loading state
      />
    </div>
  );
}