import { FC } from 'react';

interface NavigationBarProps {
  onHomePress: () => void;
}

export const NavigationBar: FC<NavigationBarProps> = ({ onHomePress }) => {
  return (
    <div className="h-nav bg-phone-bg flex items-center justify-center relative z-20">
      <button
        onClick={onHomePress}
        className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95"
      >
        <div className="w-6 h-6 rounded-sm bg-white/80" />
      </button>
    </div>
  );
}; 