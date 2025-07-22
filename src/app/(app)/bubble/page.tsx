import Skeleton,{SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import defaultConfig from '../../../../data/modifier.json';
import { BubbleSettings } from '@/types/Modifier';
import BubbleIcon from '@/components/icons/BubbleIcon';

interface BubbleProps {
  isDarkMode?: boolean;
  loading?: boolean;
  settings?: Partial<BubbleSettings>;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const defaultSettings: BubbleSettings = defaultConfig.bubble;

export default function Bubble({
  isDarkMode = false,
  loading = false,
  settings = {},
  isHovered = false,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}: BubbleProps) {
  const bubbleSettings: BubbleSettings = {
    ...defaultSettings,
    ...settings,
  };

  if (loading) {
    return (
      <SkeletonTheme
        baseColor={isDarkMode ? '#2a2a2a' : '#e0e0e0'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f0f0f0'}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center">
            <Skeleton circle height={64} width={64} />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center">
        <div
          data-testid="bubble-container"
          className="relative flex items-center justify-center rounded-full w-16 h-16 transition-colors duration-300 cursor-pointer"
          style={{ backgroundColor: bubbleSettings.bgColor || '#ff5101' }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <BubbleIcon
            iconColor={bubbleSettings.iconColor}
            bgColor={bubbleSettings.bgColor}
            dotsColor={bubbleSettings.dotsColor}
            hovered={isHovered}
          />
        </div>
      </div>
    </div>
  );
}