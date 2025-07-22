// src/app/(app)/eye-catcher/page.tsx
import EyecatcherClient from "@/components/EyecatcherClient";

export default function EyeCatcherPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Eye Catcher Page</h1>
      <EyecatcherClient
        isDarkMode={false}
        loading={false}
        settings={{
          title: 'Welcome!',
          text: 'Start a conversation',
          bgColor: '#FF6B6B',
          textColor: '#FFFFFF',
        }}
      />
    </div>
  );
}