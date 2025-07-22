// components/modifier/GreetingContent.tsx
import { GreetingSettings } from '@/types/Modifier';
import Image from 'next/image';
import CloseButton from './CloseButton';
import CustomButton from './CustomButton';

interface GreetingContentProps {
  settings: GreetingSettings;
}

const GreetingImage = ({ src, alt, fallbackSrc }: { src: string; alt: string; fallbackSrc: string }) => (
  <div className="flex">
    <Image
      src={src || fallbackSrc}
      alt={alt}
      width={230}
      height={150}
      className="object-cover w-full"
    />
  </div>
);

export default function GreetingContent({ settings }: GreetingContentProps) {
  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center">
        <div className="relative w-[230px] mx-auto">
          <div className="absolute -top-7 right-0 z-20">
            <CloseButton headingColor={settings.headingColor} />
          </div>

          <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
            <GreetingImage
              src={settings.imageUrl}
              alt="Hello"
              fallbackSrc="/landingpage/hello01.png"
            />

            <div className="p-3.5 text-sm leading-snug break-words max-w-full overflow-hidden">
              <h2
                className="mb-2 font-semibold"
                style={{ color: settings.headingColor }}
              >
                {settings.headingText}
              </h2>
              <p style={{ color: settings.paraColor }}>{settings.paraText}</p>
            </div>

            <ul className="flex flex-col gap-2 px-2 pb-2 pt-[7px]">
              <CustomButton
                text={settings.primaryBtnText}
                bgColor={settings.primaryBtnColor}
                isVisible={settings.showPrimaryBtn}
              />
              <CustomButton
                text={settings.secondaryBtnText}
                bgColor={settings.secondaryBtnColor}
                icon={<span>💬</span>}
                isVisible={settings.showSecondaryBtn}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}