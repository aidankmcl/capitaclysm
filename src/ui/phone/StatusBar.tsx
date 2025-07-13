import { FC, useEffect, useState } from 'react';

export const StatusBar: FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  return (
    <div className="h-status bg-transparent text-phone-text flex items-center justify-between px-6 pt-2 text-sm font-medium relative z-20">
      <div className="flex items-center gap-2">
        <span>{timeString}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="icon-[lucide--signal] w-4 h-4" />
        <div className="icon-[lucide--wifi] w-4 h-4" />
        <div className="flex items-center gap-1">
          <span className="text-xs">100%</span>
          <div className="icon-[lucide--battery-full] w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
