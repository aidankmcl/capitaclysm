export * from "./colors";
export * from "./math";

export const getAppColorClass = (themeColor: string): string => {
  switch (themeColor) {
    case 'var(--color-app-uber)':
      return 'bg-app-uber';
    case 'var(--color-app-contacts)':
      return 'bg-app-contacts';
    case 'var(--color-app-realestate)':
      return 'bg-app-realestate';
    case 'var(--color-app-trading)':
      return 'bg-app-trading';
    case 'var(--color-app-settings)':
      return 'bg-app-settings';
    default:
      return 'bg-gray-600';
  }
}; 