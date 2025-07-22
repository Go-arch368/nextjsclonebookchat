// src/components/icons/BubbleIcon.tsx
"use client";

import style from 'styled-jsx/style';

type BubbleIconProps = {
  bgColor: string;
  iconColor: string;
  dotsColor: string;
  hovered: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
};

export default function BubbleIcon({
  bgColor,
  iconColor,
  dotsColor,
  hovered,
  width = 28,
  height = 28,
  className = '',
}: BubbleIconProps) {
  const dotSize =
    typeof width === 'number'
      ? width / 5
      : typeof width === 'string' && width.endsWith('px')
      ? parseInt(width) / 5
      : 6;

  if (hovered) {
    return (
      <>
        <div className={`flex gap-1 items-center ${className}`} style={{ height, width }}>
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              style={{
                width: dotSize,
                height: dotSize,
                backgroundColor: dotsColor,
                animation: `jump 1.2s infinite ease-in-out ${i * 0.2}s`,
                borderRadius: '9999px',
                display: 'inline-block',
              }}
            />
          ))}
        </div>
        <style jsx>{`
          @keyframes jump {
            0%,
            80%,
            100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-80%);
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <svg
      viewBox="0 0 32 32"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      <path
        fill={iconColor}
        d="M12.63,26.46H8.83a6.61,6.61,0,0,1-6.65-6.07,89.05,89.05,0,0,1,0-11.2A6.5,6.5,0,0,1,8.23,3.25a121.62,121.62,0,0,1,15.51,0A6.51,6.51,0,0,1,29.8,9.19a77.53,77.53,0,0,1,0,11.2,6.61,6.61,0,0,1-6.66,6.07H19.48L12.63,31V26.46Z"
      />
      <path
        fill={bgColor}
        d="M19.57,21.68h3.67a2.08,2.08,0,0,0,2.11-1.81,89.86,89.86,0,0,0,0-10.38,1.9,1.9,0,0,0-1.84-1.74,113.15,113.15,0,0,0-15,0A1.9,1.9,0,0,0,6.71,9.49a74.92,74.92,0,0,0-.06,10.38,2,2,0,0,0,2.1,1.81h3.81V26.5Z"
      />
    </svg>
  );
}