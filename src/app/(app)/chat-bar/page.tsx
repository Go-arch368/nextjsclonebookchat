import ChatBarPreview from '@/components/modifier/chatBar/chatBarPreview';


function Page() {
  // These values would typically come from your data fetching or application state
  const chatBarSettings = {
    text: 'Chat with us',
    bgColor: '#007bff',
    textColor: '#ffffff',
    // ... other chat bar settings
  };

  return (
    <div>
      <ChatBarPreview
        settings={chatBarSettings}
        isDarkMode={false} // Set based on your theme detection
        loading={false} // Set based on your loading state
      />
    </div>
  );
}

export default Page;