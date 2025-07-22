// src/components/chat-widget-open/ChatWidgetPreview.tsx
import { ChatWidgetSettings, Message } from '@/types/Modifier';

// SSR-compatible ChatPreview component
function ChatPreview({
  settings,
  messages,
  isTyping = false,
  isSaving = false
}: {
  settings: ChatWidgetSettings;
  messages: Message[];
  isTyping?: boolean;
  isSaving?: boolean;
}) {
  return (
    <div className="flex-1 flex justify-center items-start">
      <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
        {/* Chat Header - SSR version */}
        <div 
          className="p-3 border-b flex justify-between items-center"
          style={{ backgroundColor: settings.footerBgColor }}
        >
          <div className="flex items-center gap-2">
            {settings.logoUrl && (
              <img 
                src={settings.logoUrl} 
                alt="Chat logo" 
                className="w-8 h-8 rounded-full object-cover"
                width={32}
                height={32}
              />
            )}
            <span 
              className="font-medium"
              style={{ color: settings.footerTextColor }}
            >
              {settings.chatTitle}
            </span>
          </div>
          {isSaving && (
            <span className="text-xs opacity-70" style={{ color: settings.footerTextColor }}>
              Saving...
            </span>
          )}
        </div>

        {/* Messages Container - SSR version */}
        <div 
          className="flex-1 p-4 overflow-y-auto"
          style={{ backgroundColor: settings.footerBgColor }}
        >
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-xs px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: message.isUser
                      ? settings.userMsgBgColor
                      : settings.botMsgBgColor,
                    color: '#000000'
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="max-w-xs px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: settings.botMsgBgColor,
                    color: '#000000'
                  }}
                >
                  Typing...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - SSR version (static) */}
        <div className="p-3 border-t" style={{ backgroundColor: settings.footerBgColor }}>
          <div className="flex gap-2">
            <div
              className="flex-1 px-4 py-2 border rounded-lg"
              style={{ 
                backgroundColor: settings.footerBgColor,
                color: settings.footerTextColor
              }}
            >
              {settings.inputPlaceholder}
            </div>
            <div
              className="px-4 py-2 rounded-lg opacity-50"
              style={{
                backgroundColor: settings.sendBtnBgColor,
                color: settings.sendBtnIconColor
              }}
            >
              Send
            </div>
          </div>
        </div>

        {/* Footer - SSR version */}
        <div
          className="p-1 border-t text-center text-xs"
          style={{
            backgroundColor: settings.footerBgColor,
            color: settings.footerTextColor
          }}
        >
          {settings.footerText}
        </div>
      </div>
    </div>
  );
}

interface ChatWidgetPreviewProps {
  initialSettings: ChatWidgetSettings;
  initialMessages?: Message[];
  isDarkMode?: boolean;
  isTyping?: boolean;
  isSaving?: boolean;
}

export default function ChatWidgetPreview({ 
  initialSettings,
  initialMessages = initialSettings.messages,
  isDarkMode = false,
  isTyping = false,
  isSaving = false
}: ChatWidgetPreviewProps) {
  // Merge with default settings
  const chatSettings: ChatWidgetSettings = {
    ...initialSettings,
    messages: initialMessages ?? initialSettings.messages,
  };


   console.log("This is the server component ");
   

  return (
    <div className="flex justify-center items-start p-6">
      <ChatPreview
        settings={chatSettings}
        messages={chatSettings.messages}
        isTyping={isTyping}
        isSaving={isSaving}
      />
    </div>
  );
}









// import { useState, useEffect, useRef } from 'react';
// import { ChatWidgetSettings, Message } from '@/types/Modifier';

// function ChatPreview({
//   settings,
//   initialMessages = [],
//   isSaving = false
// }: {
//   settings: ChatWidgetSettings;
//   initialMessages?: Message[];
//   isSaving?: boolean;
// }) {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [inputValue, setInputValue] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Typing indicator animation
//   const [typingDots, setTypingDots] = useState('');
//   useEffect(() => {
//     if (!isTyping) {
//       setTypingDots('');
//       return;
//     }

//     const interval = setInterval(() => {
//       setTypingDots(prev => {
//         if (prev.length >= 3) return '';
//         return '.'.repeat(prev.length + 1);
//       });
//     }, 300);

//     return () => clearInterval(interval);
//   }, [isTyping]);

//   const handleSendMessage = () => {
//     if (!inputValue.trim()) return;

//     // Add user message
//     const userMessage: Message = {
//       text: inputValue,
//       isUser: true,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsTyping(true);

//     // Simulate bot response after a delay
//     setTimeout(() => {
//       const botResponse: Message = {
//         text: `This is a response to: "${inputValue}"`,
//         isUser: false,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botResponse]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex-1 flex justify-center items-start">
//       <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
//         {/* Chat Header */}
//         <div 
//           className="p-3 border-b flex justify-between items-center"
//           style={{ backgroundColor: settings.footerBgColor }}
//         >
//           <div className="flex items-center gap-2">
//             {settings.logoUrl && (
//               <img 
//                 src={settings.logoUrl} 
//                 alt="Chat logo" 
//                 className="w-8 h-8 rounded-full object-cover"
//                 width={32}
//                 height={32}
//               />
//             )}
//             <span 
//               className="font-medium"
//               style={{ color: settings.footerTextColor }}
//             >
//               {settings.chatTitle}
//             </span>
//           </div>
//           {isSaving && (
//             <span className="text-xs opacity-70" style={{ color: settings.footerTextColor }}>
//               Saving...
//             </span>
//           )}
//         </div>

//         {/* Messages Container */}
//         <div 
//           className="flex-1 p-4 overflow-y-auto"
//           style={{ backgroundColor: settings.footerBgColor }}
//         >
//           <div className="space-y-3">
//             {messages.map((message, index) => (
//               <div 
//                 key={index} 
//                 className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className="max-w-xs px-4 py-2 rounded-lg"
//                   style={{
//                     backgroundColor: message.isUser
//                       ? settings.userMsgBgColor
//                       : settings.botMsgBgColor,
//                     color: message.isUser ? settings.userMsgTextColor : settings.botMsgTextColor
//                   }}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div
//                   className="max-w-xs px-4 py-2 rounded-lg"
//                   style={{
//                     backgroundColor: settings.botMsgBgColor,
//                     color: settings.botMsgTextColor
//                   }}
//                 >
//                   Typing{typingDots}
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* Input Area - Now fully functional */}
//         <div className="p-3 border-t" style={{ backgroundColor: settings.footerBgColor }}>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder={settings.inputPlaceholder}
//               className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
//               style={{ 
//                 backgroundColor: settings.inputBgColor || settings.footerBgColor,
//                 color: settings.inputTextColor || settings.footerTextColor,
//                 borderColor: settings.inputBorderColor || '#e5e7eb'
//               }}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={!inputValue.trim()}
//               className="px-4 py-2 rounded-lg disabled:opacity-50"
//               style={{
//                 backgroundColor: settings.sendBtnBgColor,
//                 color: settings.sendBtnIconColor
//               }}
//             >
//               Send
//             </button>
//           </div>
//         </div>

//         {/* Footer */}
//         <div
//           className="p-1 border-t text-center text-xs"
//           style={{
//             backgroundColor: settings.footerBgColor,
//             color: settings.footerTextColor
//           }}
//         >
//           {settings.footerText}
//         </div>
//       </div>
//     </div>
//   );
// }

// interface ChatWidgetPreviewProps {
//   initialSettings: ChatWidgetSettings;
//   initialMessages?: Message[];
//   isDarkMode?: boolean;
//   isSaving?: boolean;
// }

// export default function ChatWidgetPreview({ 
//   initialSettings,
//   initialMessages = initialSettings.messages || [],
//   isDarkMode = false,
//   isSaving = false
// }: ChatWidgetPreviewProps) {
//   return (
//     <div className="flex justify-center items-start p-6">
//       <ChatPreview
//         settings={initialSettings}
//         initialMessages={initialMessages}
//         isSaving={isSaving}
//       />
//     </div>
//   );
// }