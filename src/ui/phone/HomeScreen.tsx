import { FC } from 'react';
import { AppIcon } from './AppIcon';
import { PHONE_APPS, PhoneApp } from '~/services/apps/appRegistry';

interface HomeScreenProps {
  onAppSelect: (appId: string) => void;
}

export const HomeScreen: FC<HomeScreenProps> = ({ onAppSelect }) => {
  return (
    <div className="flex-1 p-phone pt-8 relative">
      {/* Wallpaper */}
      <div className="absolute inset-0 bg-gray-800" />
      
      {/* App grid */}
      <div className="relative z-10 grid grid-cols-4 gap-6 justify-items-center">
        {PHONE_APPS.map((app: PhoneApp) => (
          <AppIcon
            key={app.id}
            name={app.name}
            icon={app.icon}
            themeColor={app.themeColor}
            onClick={() => onAppSelect(app.id)}
          />
        ))}
      </div>
      
      {/* Dock area */}
      <div className="absolute bottom-8 left-phone right-phone">
        <div className="bg-gray-700 rounded-2xl p-4 mx-4">
          <div className="flex justify-center space-x-8">
            {/* Placeholder for dock apps */}
            <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
              <div className="icon-[lucide--grid-3x3] w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 