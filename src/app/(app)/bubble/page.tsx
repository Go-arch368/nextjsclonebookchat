// src/app/(app)/bubble/page.tsx
import BubbleClient from "@/components/BubbleClient";
export default function BubblePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bubble Page</h1>
      <BubbleClient
        bgColor="#4A90E2"
        iconColor="#FFFFFF"
        dotsColor="#FF6B6B"
        hovered={false}
        width={32}
        height={32}
      />
    </div>
  );
}