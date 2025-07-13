import { FC } from 'react';
import { getAppColorClass } from '~/utils';

interface AppIconProps {
  name: string;
  icon: string;
  themeColor: string;
  onClick: () => void;
}

export const AppIcon: FC<AppIconProps> = ({ name, icon, themeColor, onClick }) => {
  const colorClass = getAppColorClass(themeColor);
  
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95"
    >
      <div className={`w-app-icon h-app-icon rounded-app-icon flex items-center justify-center text-white text-2xl shadow-lg ${colorClass}`}>
        <i className={icon} />
      </div>
      <span className="text-white text-xs font-medium text-center leading-tight max-w-16 truncate">
        {name}
      </span>
    </button>
  );
}; 