// src/components/BubbleClient.tsx
"use client";

import BubbleIcon from "./icons/BubbleIcon";

type BubbleClientProps = {
  bgColor: string;
  iconColor: string;
  dotsColor: string;
  hovered: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
};

export default function BubbleClient({
  bgColor,
  iconColor,
  dotsColor,
  hovered,
  width = 28,
  height = 28,
  className = '',
}: BubbleClientProps) {
  return (
    <BubbleIcon
      bgColor={bgColor}
      iconColor={iconColor}
      dotsColor={dotsColor}
      hovered={hovered}
      width={width}
      height={height}
      className={className}
    />
  );
}