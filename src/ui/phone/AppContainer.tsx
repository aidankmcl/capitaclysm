import { FC } from 'react';
import { PHONE_APPS, PhoneApp } from '~/services/apps/appRegistry';

interface AppContainerProps {
  appId: string | null;
  onClose: () => void;
}

export const AppContainer: FC<AppContainerProps> = ({ appId, onClose }) => {
  const app = PHONE_APPS.find((a: PhoneApp) => a.id === appId);
  
  if (!app) return null;
  
  const AppComponent = app.component;
  
  return <AppComponent onClose={onClose} />;
}; 