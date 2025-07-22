// // app/page.tsx
// import { ChatWidgetSettings, Message } from '@/types/Modifier';
// import defaultConfig from '../../../../data/modifier.json';
// import ChatPreview from '@/components/modifier/chat-widget/ChatPreview';

// export default function Page() {
//   const defaultSettings: ChatWidgetSettings = defaultConfig.chatWidget || {
//     messages: [],
//     bgColor: '#ffffff',
//     textColor: '#000000',
//   };

//   const initialMessages: Message[] = defaultSettings.messages || [];
//   console.log("This is the server compoent");
  

//   return (
//     <div>
//       <div className="flex h-[calc(100vh-3.5rem)]">
//         <aside className="w-[220px] border-r bg-gray-50 dark:bg-zinc-900 p-4">
//           <h2 className="text-lg font-semibold mb-4 dark:text-white">Settings</h2>
//           <nav className="flex flex-col gap-2">
//             <button className="px-3 py-2 rounded-md text-left text-sm font-medium capitalize bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white">
//               Chat Widget Open
//             </button>
//           </nav>
//         </aside>
//         <main className="flex-1 p-6 overflow-y-auto">
//           <div className="max-w-4xl mx-auto space-y-6">
//             <div className="flex justify-center items-start p-6">
//               <div className="w-[370px] h-[700px] border rounded-lg overflow-hidden shadow-lg flex flex-col">
//                 {/* <ChatPreview
//                   settings={defaultSettings}
//                   initialMessages={initialMessages}
//                 /> */}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

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