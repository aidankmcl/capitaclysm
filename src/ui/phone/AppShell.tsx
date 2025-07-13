import { FC, PropsWithChildren } from 'react';
import { getAppColorClass } from '~/utils';

interface AppShellProps extends PropsWithChildren {
  title: string;
  themeColor: string;
  onClose: () => void;
  showBackButton?: boolean;
}

export const AppShell: FC<AppShellProps> = ({ 
  title, 
  themeColor, 
  onClose, 
  showBackButton = true, 
  children 
}) => {
  const colorClass = getAppColorClass(themeColor);
  
  return (
    <div className="flex-1 flex flex-col animate-app-launch">
      {/* App Header */}
      <div className={`flex items-center justify-between px-4 py-3 text-white relative z-20 ${colorClass}`}>
        {showBackButton && (
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full"
          >
            <div className="icon-[lucide--chevron-left] w-6 h-6" />
          </button>
        )}
        <h1 className="text-lg font-bold flex-1 text-center">{title}</h1>
        {showBackButton && <div className="w-8" />} {/* Spacer */}
      </div>
      
      {/* App Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}; 