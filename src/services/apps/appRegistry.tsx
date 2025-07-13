import { ComponentType } from 'react';

export interface PhoneApp {
  id: string;
  name: string;
  icon: string;
  component: ComponentType<{ onClose: () => void }>;
  themeColor: string;
  isSystem?: boolean;
}

// Placeholder components - will be replaced with actual implementations
const UberApp = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 text-center">
    <h2 className="text-xl font-bold mb-4">Uber App</h2>
    <p className="mb-4">Move functionality will be implemented here</p>
    <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
      Close
    </button>
  </div>
);

const ContactsApp = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 text-center">
    <h2 className="text-xl font-bold mb-4">Contacts App</h2>
    <p className="mb-4">Players list will be implemented here</p>
    <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
      Close
    </button>
  </div>
);

const RealEstateApp = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 text-center">
    <h2 className="text-xl font-bold mb-4">Real Estate App</h2>
    <p className="mb-4">Properties will be implemented here</p>
    <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
      Close
    </button>
  </div>
);

const TradingApp = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 text-center">
    <h2 className="text-xl font-bold mb-4">Trading App</h2>
    <p className="mb-4">Stock trading will be implemented here</p>
    <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
      Close
    </button>
  </div>
);

const SettingsApp = ({ onClose }: { onClose: () => void }) => (
  <div className="p-4 text-center">
    <h2 className="text-xl font-bold mb-4">Settings App</h2>
    <p className="mb-4">Game settings will be implemented here</p>
    <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
      Close
    </button>
  </div>
);

export const PHONE_APPS: PhoneApp[] = [
  { 
    id: 'uber', 
    name: 'Uber', 
    icon: 'fi-rr-car', 
    component: UberApp, 
    themeColor: 'var(--color-app-uber)' 
  },
  { 
    id: 'contacts', 
    name: 'Contacts', 
    icon: 'fi-rr-users', 
    component: ContactsApp, 
    themeColor: 'var(--color-app-contacts)' 
  },
  { 
    id: 'realestate', 
    name: 'Zillow', 
    icon: 'fi-rr-home', 
    component: RealEstateApp, 
    themeColor: 'var(--color-app-realestate)' 
  },
  { 
    id: 'trading', 
    name: 'Robinhood', 
    icon: 'fi-rr-trending-up', 
    component: TradingApp, 
    themeColor: 'var(--color-app-trading)' 
  },
  { 
    id: 'settings', 
    name: 'Settings', 
    icon: 'fi-rr-settings', 
    component: SettingsApp, 
    themeColor: 'var(--color-app-settings)' 
  },
]; 