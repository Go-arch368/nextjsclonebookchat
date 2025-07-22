// app/greeting/page.tsx
import { GreetingSettings } from '@/types/Modifier';
import defaultConfig from '../../../../data/modifier.json';
import GreetingContent from '@/components/modifier/GreetingContent';

export default function Greeting() {
  // Load settings from JSON server-side
  const defaultSettings: GreetingSettings = defaultConfig.greeting || {
    headingColor: '#000000',
    paraColor: '#333333',
    primaryBtnColor: '#007bff',
    secondaryBtnColor: '#28a745',
    headingText: 'Welcome to LiveChat!',
    paraText: 'Sign up free or talk with our product experts',
    imageUrl: '/landingpage/hello01.png',
    primaryBtnText: 'Sign Up',
    secondaryBtnText: 'Chat Now',
    showPrimaryBtn: true,
    showSecondaryBtn: true,
  };

  return (
    <div>
      <GreetingContent settings={defaultSettings} />
    </div>
  );
}