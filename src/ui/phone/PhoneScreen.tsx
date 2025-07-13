import { FC, PropsWithChildren } from 'react';

export const PhoneScreen: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-phone h-phone bg-phone-bg rounded-phone shadow-2xl mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-phone-bg flex flex-col">
        {children}
      </div>
      {/* Phone frame/bezels */}
      <div className="absolute inset-0 rounded-phone border-4 border-gray-800 pointer-events-none" />
      
      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
    </div>
  );
}; 